use crate::destinations::twitter;

#[tokio::test]
pub async fn test_scrape_twitter() {
    twitter::scrape_tweet("123".to_string()).await.unwrap();
}
