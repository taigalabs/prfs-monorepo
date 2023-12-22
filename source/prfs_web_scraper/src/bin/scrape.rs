use colored::Colorize;
use prfs_db_interface::database2::Database2;
use prfs_web_scraper::destinations::twitter;
use std::net::SocketAddr;
use std::sync::Arc;

#[tokio::main]
pub async fn main() {
    twitter::scrape_tweet("123".to_string()).await.unwrap();
}
