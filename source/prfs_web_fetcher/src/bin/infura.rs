use prfs_web_fetcher::destinations::infura;

#[tokio::main]
pub async fn main() {
    println!("123123");
    infura::fetch_asset().await.unwrap();
}
