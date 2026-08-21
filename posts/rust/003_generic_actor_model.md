# 3. Designing and Implementing a Generic Actor Model for Concurrency

The message-passing method I implemented in the previous chapter is very interesting to me. Now we are taking another step forward and implementing a generic Actor Model for SquireBot. This could be extended into a crate in the future.

As Tyler suggested, we start with defining how we want the user experience to look like.
Here is how it could look like:

```rust
#[tokio::main]
async fn main() {
    // First possible API for initializing the client and the actor
    // The client spawns the Actor task as well.
    let client = client::Client::new(0, action);

    // Second possible API for initializing the client and the actor
    // The ActorBuilder creates the Actor and client, and spawns the Actor when called.
    // let client = actor::ActorBuilder::create().spawn();

    let data = 5;
    let (tracker, message) = Message::create(&data);
    client.send(message);

    let result = tracker.await;
    match result {
        Ok(val) => println!("tracker: {val}"),
        Err(err) => println!("tracker: err: {}", err),
    }
}
```

1. Since we are approaching the problem from the perspective of the users, let's play the game in our heads a bit. Some users might want the actors to communicate between each other, so more fine-grained control could be desirable. Therefore we thought of providing the users more than one way to initialize `Actor`s and `Client`s. In the first one, we are initializing the client and leaving the initialization of the actor to the client's constructor. This allows the users to avoid interacting with the `Actor` completely with minimal initialization.

But in case the users want to go configure the actor in detail, we are planning to provide a `Builder` approach and reduce boilerplate.

2. The `action` here that I have not initialized yet (because it's design isn't final) is how the actor will handle incoming messages. So we initialize the client with the initial state and the action. I will show their signatures and implementations in a minute.

3. Creating a message creates a one-shot channel and returns a `Tracker` for the actor's response. `client` sends the message, the `Actor` processes it and we are quite good. Note that this piece of code doesn't allow us to send closures and manipulate state yet. WIP!

the code for client:

```rust
pub struct Client<M> {
    handle: mpsc::UnboundedSender<M>,
}

impl<M> Client<M> {
    pub fn new<A, S>(state: S, action: A) -> Self
    where
        M: Send + 'static,
        S: Send + 'static,
        A: Send + FnMut(&mut S, M) -> () + 'static,
    {
        let (handle, actor) = Actor::new(state, action);
        tokio::spawn(actor.run());
        Self { handle }
    }

    pub fn send(&self, message: M) {
        let _ = self.handle.send(message);
    }
}
```

actor:
```rust
use tokio::sync::mpsc;

pub struct Actor<T, A, M> {
    state: T,
    receiver: mpsc::UnboundedReceiver<M>,
    action: A,
}

impl<T, A, M> Actor<T, A, M>
where
    A: Send + FnMut(&mut T, M) -> (),
{
    pub fn new(state: T, action: A) -> (mpsc::UnboundedSender<M>, Self) {
        let (sender, receiver) = mpsc::unbounded_channel();
        (
            sender,
            Self {
                state,
                receiver,
                action,
            },
        )
    }

    pub async fn run(mut self) {
        while let Some(message) = self.receiver.recv().await {
            (self.action)(&mut self.state, message);
        }
    }
}
```

message:
```rust
pub struct Message<T> {
    pub data: T,
    pub sender: oneshot::Sender<T>,
}

impl Message<i32> {
    pub fn create(data: &i32) -> (Tracker<i32>, Self) {
        let (sender, receiver) = oneshot::channel();
        let message = Self {
            data: *data,
            sender,
        };
        let tracker = Tracker::new(receiver);
        (tracker, message)
    }
}
```

and tracker:

```rust
pub struct Tracker<T> {
    receiver: oneshot::Receiver<T>,
}

impl<T> Tracker<T> {
    pub fn new(receiver: oneshot::Receiver<T>) -> Self {
        Self { receiver }
    }
}

impl<T> Future for Tracker<T> {
    type Output = Result<T, oneshot::error::RecvError>;

    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output> {
        let this = self.get_mut();
        match Pin::new(&mut this.receiver).poll(cx) {
            Poll::Ready(Ok(v)) => Poll::Ready(Ok(v)),
            Poll::Ready(Err(e)) => Poll::Ready(Err(e)),
            Poll::Pending => Poll::Pending,
        }
    }
}
```