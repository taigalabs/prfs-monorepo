use colored::Colorize;
use hyper::Server;
use prfs_email_auth_server::envs::ENVS;
use prfs_email_auth_server::paths::PATHS;
use prfs_email_auth_server::server::router;
use prfs_email_auth_server::server::state::ServerState;
use prfs_email_auth_server::EmailAuthServerError;
use routerify::RouterService;
use std::net::SocketAddr;
use std::sync::Arc;

const PORT: u16 = 4020;

// #[tokio::main]
// async fn main() -> Result<(), ApiServerError> {
//     println!(
//         "{} pkg: {}, curr_dir: {:?}",
//         "Starting".green(),
//         env!("CARGO_PKG_NAME"),
//         std::env::current_dir(),
//     );

//     ENVS.check();

//     let server_state = Arc::new(ServerState::init().await.unwrap());

//     let router = router::make_router(server_state).expect("make_router fail");
//     let service = RouterService::new(router).expect("router service init fail");

//     let addr = SocketAddr::from(([0, 0, 0, 0], PORT));
//     let server = Server::bind(&addr).serve(service);

//     println!("Prfs backend is running on: {}", addr);
//     if let Err(err) = server.await {
//         eprintln!("Server error: {}", err);
//     }

//     Ok(())
// }
// use futures::TryStreamExt;
use tokio::net::TcpStream;

// #[tokio::main]
async fn main() -> Result<(), EmailAuthServerError> {
    let args: Vec<String> = env::args().collect();
    if args.len() != 4 {
        eprintln!("need three arguments: imap-server login password");
        // bail!("need three arguments");
    } else {
        let res = fetch_inbox_top(&args[1], &args[2], &args[3]).await?;
        println!("**result:\n{}", res.unwrap());
        Ok(())
    }
}

async fn fetch_inbox_top(imap_server: &str, login: &str, password: &str) -> Result<Option<String>> {
    let imap_addr = (imap_server, 993);
    let tcp_stream = TcpStream::connect(imap_addr).await?;
    let tls = async_native_tls::TlsConnector::new();
    let tls_stream = tls.connect(imap_server, tcp_stream).await?;

    let client = async_imap::Client::new(tls_stream);
    println!("-- connected to {}:{}", imap_addr.0, imap_addr.1);

    // the client we have here is unauthenticated.
    // to do anything useful with the e-mails, we need to log in
    let mut imap_session = client.login(login, password).await.map_err(|e| e.0)?;
    println!("-- logged in a {}", login);

    // we want to fetch the first email in the INBOX mailbox
    imap_session.select("INBOX").await?;
    println!("-- INBOX selected");

    // fetch message number 1 in this mailbox, along with its RFC822 field.
    // RFC 822 dictates the format of the body of e-mails
    let messages_stream = imap_session.fetch("1", "RFC822").await?;
    let messages: Vec<_> = messages_stream.try_collect().await?;
    let message = if let Some(m) = messages.first() {
        m
    } else {
        return Ok(None);
    };

    // extract the message's body
    let body = message.body().expect("message did not have a body!");
    let body = std::str::from_utf8(body)
        .expect("message was not valid utf-8")
        .to_string();
    println!("-- 1 message received, logging out");

    // be nice to the server and log out
    imap_session.logout().await?;

    Ok(Some(body))
}
