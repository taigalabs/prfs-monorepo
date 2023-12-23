use crate::destinations::twitter;

#[tokio::test]
pub async fn test_scrape_twitter() {
    let url = "https://twitter.com/saksaha_team/status/1738539492854890584";

    twitter::scrape_tweet(url.to_string()).await.unwrap();
}
