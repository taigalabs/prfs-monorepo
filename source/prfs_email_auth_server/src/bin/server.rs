use prfs_email_auth_server::gmail::run_gmail_auth;
use prfs_email_auth_server::server::state::ServerState;
use std::sync::Arc;

#[tokio::main]
async fn main() {
    let state = {
        let s = ServerState::init().await.unwrap();
        Arc::new(s)
    };

    run_gmail_auth(state).await;
}
