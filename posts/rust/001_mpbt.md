# 1. Passing messages between threads

I am trying to implement simple message-passing channels in Rust. I want to share/log my learning progress. I think it will be fun to return to it in some months/years.

**Note:** I am a complete beginner to Rust and haven't dealt with this sort of concurrency before.

The task is simple: I will have two channels running on different threads or running as concurrent processes. 
One of them will be the client, asking for the amount of ice cream the server has. Client's actions can be triggered by command line inputs.

The server will tell the client how much ice cream it has. The ice cream is 1kg to begin with, and melts by 10g each second. Bonus: each question can decrease the amount of ice cream by 20g. This will force the server to implement some kind of concurrent operation handling.

## First try
I read [tokio docs](https://tokio.rs/tokio/tutorial/channels). I initialize the channel, and pass the transmitter and receiver to the tasks I spawn in the main thread (which felt intuitive). But the program immediately ends. No messages after the initial "Let's go!" are printed.

```rust
use tokio::sync::mpsc;

#[tokio::main]
async fn main() {
    println!("Let's go!");
    // Create the channel
    let (tx, rx) = mpsc::channel(8);
    // Spawn the server task.
    tokio::spawn(run_server(rx));

    // Spawn the client task.
    tokio::spawn(run_client(tx));
}

async fn run_server(mut rx: mpsc::Receiver<String>) {
    println!("running server");
    while let Some(message) = rx.recv().await {
        println!("GOT = {}", message);
    }
}

async fn run_client(tx: mpsc::Sender<String>) {
    println!("sending from first handle");
    // wait for 2 seconds
    tokio::time::sleep(tokio::time::Duration::from_secs(2)).await;
    println!("woke up from sleep");

    tx.send("sending from first handle".to_owned())
        .await
        .unwrap();
}
```

I think the problem with this was that my program was not waiting for any of the tasks I spawned. It just started the threads, and there was nothing else to do, so it returned.

## Second try
Run the server in the main thread and wait for it to complete. This works, but I think I am blocking the main thread with the server.

Also I got the intuition that once the function owning the transmitter (client) returns, it is dropped, so the channel is closed.

```rust
use tokio::sync::mpsc;

#[tokio::main]
async fn main() {
    println!("Let's go!");
    let (tx, rx) = mpsc::channel(8);
    // Spawn the client task.
    tokio::spawn(run_client(tx));

    // the server is running, but it blocks
    _run_server(rx).await;
}

// we do not use this function in this version
async fn _run_server(mut rx: mpsc::Receiver<String>) {
    println!("running server");
    while let Some(msg) = rx.recv().await {
        println!("received: {:?}", msg);
    }
}

async fn run_client(tx: mpsc::Sender<String>) {
    // wait for 2 seconds
    tokio::time::sleep(tokio::time::Duration::from_secs(2)).await;
    let msg = String::from("Hello ice cream guy");
    tx.send(msg).await.expect("can not send user on channel");
}
```

## Third try
I spawn a new task for the server and wait for it to complete. This works, but I don't really understand why. I don't know if I am blocking the main thread as well. I also feel like there is a cleaner way to do this. Added understanding this thoroughly to my task.

```rust
use tokio::sync::mpsc;

#[tokio::main]
async fn main() {
    println!("Let's go!");
    let (tx, rx) = mpsc::channel(8);
    // Spawn the client task.
    tokio::spawn(run_client(tx));

    // Spawn the server task in a way it doesnt block the main thread
    tokio::spawn(async move {
        run_server(rx).await;
    })
    .await
    .unwrap();
}

// we do not use this function in this version
async fn run_server(mut rx: mpsc::Receiver<String>) {
    println!("running server");
    while let Some(msg) = rx.recv().await {
        println!("received: {:?}", msg);
    }
}

async fn run_client(tx: mpsc::Sender<String>) {
    // wait for 2 seconds
    tokio::time::sleep(tokio::time::Duration::from_secs(2)).await;

    let msg = String::from("Hello ice cream guy");

    tx.send(msg).await.expect("can not send user on channel");
}
```

**Minor update:** I confirmed my hunch that when the function using the transmitter returns, the channel is closed.

While trying to learn about this, I read [something on the Rust book](https://doc.rust-lang.org/book/ch16-02-message-passing.html) that excited me:
> One increasingly popular approach to ensuring safe concurrency is message passing, where threads or actors communicate by sending each other messages containing data.
> Here’s the idea in a slogan from the Go language documentation: *“Do not communicate by sharing memory; instead, share memory by communicating.”*

I love Go, and seeing a wink to its docs made my day.

## Final attempt

I did some improvements and kinda nailed the task. The #rustlang discord community helped me.

I learned from them a couple of things:
1. I should await the tasks, so that the program will wait for them to complete. In order for them not to block the main thread, I should spawn the tasks, and await the futures returned by the tasks somewhere else. Any code that will run in the main thread should run in between.

2. I could also use `join!`, but that's overkill because it's used for lazy futures, and tokio starts the tasks immediately. Therefore awaiting them in series is enough and idiomatic.

I didn't understand when to use `join!` exactly, but I understand what's going on with my code.

Here is what I did with what I've learnt:

```rust
use tokio::sync::{mpsc, oneshot};
use tokio::time::{self, Duration, Instant};

#[tokio::main]
async fn main() {
    println!("Let's go!");
    let (tx, rx) = mpsc::channel(8);

    let client = tokio::spawn(run_client(tx));
    let server = tokio::spawn(run_server(rx));

    client.await.unwrap();
    server.await.unwrap(); // The main thread will not return until server returns. 
}
```

**Receiving responses:**

I wanted the clients to be able to send requests and receive responses to those. I accidentally asked GPT to tell me how receive responses from the server so it recommended me to use oneshot channels. So I created a ClientRequest to be sent.

```rust
#[derive(Debug)]
struct ClientRequest {
    message: String,
    tx: oneshot::Sender<String>,
}
```

**The server:**
Ice cream melts. I added this to see how data processing within the server could be a part of the whole message exchanging program. I had seen the `interval.tick` before, but Copilot completed the piece of code that ticks the timer. I will learn about how that works.

```rust
async fn run_server(mut rx: mpsc::Receiver<ClientRequest>) {
    println!("SERVER; I will give one person some ice cream!");
    let mut ice_cream_amount = 50;
    let mut interval = time::interval_at(
        Instant::now() + Duration::from_secs(1),
        time::Duration::from_secs(1),
    );

    loop {
        tokio::select! {
            _ = interval.tick() => {
                if ice_cream_amount < 10 {
                    println!("SERVER; no more ice cream!");
                    return;
                }
                ice_cream_amount -= 10;
            }
            Some(ClientRequest { message, tx }) = rx.recv() => {
                println!("SERVER; received: {:?}", message);

                let response = format!("Here is your ice cream! I have {ice_cream_amount} left!");
                tx.send(response).unwrap();
            }
            else => {
                println!("SERVER; I don't know what's happening here!");
                break;
            }
        }
    }
}
```

**Client:**

Every two seconds, the client will ask the server for ice cream, and report how much ice cream is left. It creates a oneshot channel and passes it to the server for an answer. It is blocked until the server responds.

```rust
async fn run_client(tx: mpsc::Sender<ClientRequest>) {
    loop {
        tokio::time::sleep(tokio::time::Duration::from_secs(2)).await;
        if tx.is_closed() {
            println!("CLIENT; Ice cream guy is gone! I guess I will go home now.");
            return;
        }
        let (response_tx, response_rx) = oneshot::channel();
        let new_msg = ClientRequest {
            message: String::from("Hello ice cream guy, give me ice cream!"),
            tx: response_tx,
        };
        tx.send(new_msg)
            .await
            .expect("can not send user on channel");

        let answer = response_rx.await.unwrap();
        println!("CLIENT; I knew you loved me!: {:?}", answer);
    }
}
```

I might work on a more complicated implementation by adding the following:
- There are more than one clients, and each time the clients ask for ice cream, the amount of ice cream decreases.
- The client's are not blocked when they are waiting for a response from the server.

Another insight I gained due to the help of a Rust developer was that the Go idiom I mentioned was more than a best practice in Rust. The compiler has strict constraints on how data can be modified by different threads.
