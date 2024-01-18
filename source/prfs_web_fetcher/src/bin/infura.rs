use prfs_web_fetcher::destinations::infura;

#[tokio::main]
pub async fn main() {
    infura::fetch_asset("0xD6E4aA932147A3FE5311dA1b67D9e73da06F9cEf")
        .await
        .unwrap();
}
