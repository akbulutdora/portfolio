# 2. Improvement to message passing: Requesting arbitrary data

In the previous exercise, I implemented a simple program where a client and server ran asynchronously and communicated by passing messages. This time, the client will send arbitrary queries to the server to execute.

---
## Design

### Server
- The server holds a mutable database. To keep things simple, this is a simple data structure. There is information about the ice cream the server has such as the existing flavors, their recipes, existing orders and which flavors they are in, etc. The database fields are as follows:
  - `flavors_stock: Vec<String>` -> represents the flavors in stock. 
  - `flavor_recipes: HashMap<String, Vec<String>>` -> represents the recipes of each flavor (it is guaranteed that the existing flavors can only be flavors from this list).
  - I can add more later if I like.
- The database is initialized upon `run_server()`. When it receives a request, it calls the closure sent with the request on the database.
- The server doesn't deal with error handling. It returns a `Result` to the client. The content of the result will be of the generic type passed from the client.

### Client
- The client sends queries to the server. The `ClientRequest` consists of a one-shot channel and query. The query is a `FnOnce` function that takes the server's data as a reference (`&Database`), and the return type is arbitrary. I think I can achieve this using a generic type and trait bounds (Even though I understand generics, trait objects and traits, I still need to figure this out).
- For example, the client can query the database for how many different flavors it has (integer), which flavors do not have dairy in their recipes (list of strings), and more.


A simple diagram of the communication process I made GPT draw for me:
```
+---------+                           +--------+
|         | --(1) Prepare Query-----> |        |
|  Client |                           | Server |
|         |                           |        |
+---------+                           +--------+
                                       |
                                       V
                             (2) Execute Query on Database
                                       |
                                       V
+---------+                           +--------+
|         | <---(3) Send Result ----- |        |
|  Client |                           | Server |
|         |                           |        |
+---------+                           +--------+

```

---
## Implementation

### First attempt

The `Query` struct and its methods lie at the heart of this task. So let's take a look at my first implementation:

```rust
pub struct Query {
    tx: oneshot::Sender<Box<dyn Any + Send>>,
    f: Box<dyn FnMut(&Database) -> Box<dyn Any + Send> + Send>,
}

impl Query {
    // used by the server
    pub fn execute(mut self, database: &Database) {
        let result = (self.f)(database);
        let _ = self.tx.send(result);
    }

    // used by the client
    pub fn new<F>(f: F) -> (Self, oneshot::Receiver<Box<dyn Any + Send>>)
    where
        F: FnMut(&Database) -> Box<dyn Any + Send> + Send + 'static,
    {
        let (tx, rx) = oneshot::channel();
        let f = Box::new(f);
        let query = Self { tx, f };

        (query, rx)
    }
}
```

My first approach was to have the one-shot channel and closure that is sent as fields of the query. This felt natural and intuitive. The client creates a `Query` using the `new` constructor, boxes the closure to store it and returns the query as well as the one-shot channel for the response. The role of the server is to execute the given closure. The execute method is also responsible for sending the result back to the client, so the server is completely blind to the inner workings of the query or the client. But this created an indirect and verbose implementation.

I could implement the server as I expected: But the client side didn't go as expected. It worked, but it was not simple at all.
```rust
let f: Box<dyn FnMut(&Database) -> Box<dyn Any + Send> + Send> =
    Box::new(move |database: &crate::server::Database| {
        Box::new(database.flavor_recipes.contains_key(&Flavor::Chocolate))
    });
let (new_msg, response_rx) = Query::new(f);
tx.send(new_msg)
    .await
    .expect("can not send user on channel");

match response_rx.await {
    Ok(value) => {
        // Here, `value` is a `Box<dyn Any + Send>`. You'll have to downcast it
        // to the type you know it should be (in this case, `bool`), and handle
        // the case where it's not the type you expected.
        match value.downcast_ref::<bool>() {
            Some(b) => {
                println!("CLIENT; received response: {}", b);
            }
            None => {
                println!("CLIENT; received response of unexpected type");
            }
        }
    }
}
```

Notice the chaos and verbosity I had to go through to (1) create the closure to the query and (2) downcast the response. The first problem could be sorted out to one degree by moving the boxing operation into the query constructor, but the second will not be handled like this.

I had a discussion with my senior [Tyler](https://github.com/TylerBloom) to overcome this issue. The actual purpose of these tasks is to learn Rust and contribute to Tyler's open-source project, [Monarch Development](https://github.com/MonarchDevelopment). Our discussion was fruitful, let me summarize the main points and what I've learned.

1. Usage of `Any` indeed brings verbosity and complication. The way to figure that out goes by changing the signature of the `Query::new()` constructor and giving it generic types.

I got his advice wrong (now I see what I did wrong clearer) and went for changing the Query struct instead. I had three approaches (all of which were wrong):

1. Make the `Query` struct generically typed: This resulted in a hugely verbose `run_client` and `run_server` function signature, not helping with downcasting from `Any`even a bit.

```rust
pub async fn run_client(tx: mpsc::Sender<Query<Result<Box<dyn Any + Send>, QuError>>>)
```

2. Having different flavors for the `Query`, making it an enum would also not be as good as it introduced another type of complexity to the program.
```rust
struct FlavorExistsQuery;
struct FlavorCountQuery;
struct FlavorWithoutMilkQuery;
```

This was when Tyler told me that Query was at the heart of the problem. `Query` should not have a generic type, and they told me to think more from the perspective of the server and move more of the logic into the closure I box. Here, we are done with the first attempt. You can find the source code [here](https://github.com/akbulutdora/rust-learning-projects/tree/9c46a484135707c3cac8bce9308289b6f9b8eb0e/008.%20rust-icecream-db-query/icecream-db-query). Now we come to the solution.

### Second attempt

I was very surprised and excited at the solution.

```rust
pub struct Query {
    execute_and_send: Box<dyn FnOnce(&Database) + Send>,
}

/// [Query::new] constructor needs to take a closure of type [FnOnce(&Database) -> T + Send + 'static]
/// it should return a receiver as well as the query object
impl Query {
    // used by the client
    pub fn new<T, F>(f: F) -> (Self, oneshot::Receiver<T>)
    where
        F: FnOnce(&Database) -> T + Send + 'static,
        T: Debug + Send + 'static,
    {
        let (tx, rx) = oneshot::channel();
        let execute_and_send = Box::new(move |database: &Database| {
            let result = f(database);
            let _ = tx.send(result);
        });
        let query = Self { execute_and_send };

        (query, rx)
    }

    // used by the server
    pub fn execute(self, database: &Database) {
        (self.execute_and_send)(database);
    }
}
```

The query constructor takes a closure and wraps it into another closure. The latter executes the former, sends the result through the channel and returns nothing. This way, we can avoid using any generic types or trait objects in the `Query` struct. This is a very flexible and clear design!

Now both the client and server codes are much simpler.

Client:
```rust
let (q, response_rx) =
        Query::new(|database: &Database| database.flavor_recipes.contains_key(&Flavor::Chocolate));
    tx.send(q).await.expect("CLIENT; can not send on channel");
    match response_rx.await {
        Ok(value) => println!(
            "CLIENT; I asked if he has chocolate flavor! He said {}",
            value
        ),
        Err(e) => println!("CLIENT; failed to receive response: {:?}", e),
    }
```

Server:
```rust
//...
Some(query) = rx.recv() => query.execute(&mut database),
//...
```

I think this is a very elegant solution. I don't find it very intuitive yet: It feels like bending my head and looking at the world upside down, but I find the challenge of digesting this exciting.