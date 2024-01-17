use prfs_tls_relayer::destinations::infura;

#[tokio::main]
pub async fn main() {
    println!("123123");
    infura::fetch().await;
}
