use prfs_web_fetcher::destinations::infura::{self, InfuraFetcher};

#[tokio::main]
pub async fn main() {
    let fetcher = InfuraFetcher::new();
    fetcher
        .fetch_asset("0xD6E4aA932147A3FE5311dA1b67D9e73da06F9cEf")
        .await
        .unwrap();
}
