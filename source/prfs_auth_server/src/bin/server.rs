// use prfs_auth_op_server::gmail::run_gmail_auth;
// use prfs_auth_op_server::server::server::make_server;
// // use prfs_auth_op_server::server::router::make_router;
// use prfs_auth_op_server::server::state::ServerState;
// use routerify::RouterService;
// use std::net::SocketAddr;
// use std::sync::Arc;

// // const PORT: u16 = 4020;

// #[tokio::main]
// async fn main() {
//     // run_gmail_auth(state).await;

//     let server_state = {
//         let s = ServerState::init().await.unwrap();
//         Arc::new(s)
//     };

//     let server = make_server(server_state);

//     // let router = make_router(server_state).unwrap();
//     // let service = RouterService::new(router).unwrap();
//     // let addr: SocketAddr = ([0, 0, 0, 0], PORT).into();
//     // let server = Server::bind(&addr).serve(service);

//     // println!("Server is running on: {}", addr);

//     // if let Err(err) = server.await {
//     //     eprintln!("Server error: {}", err);
//     // }

//     tokio::select! {
//         _ = tokio::signal::ctrl_c() => {},
//         _ = server => {},
//     }
// }
