use crate::{crawler::Crawler, destinations::twitter};

#[tokio::test]
pub async fn test_scrape_twitter() {
    let tweet_url = "https://twitter.com/saksaha_team/status/1738539492854890584";
    let twitter_handle = "saksaha_team";
    // let str = "atst-atst001 Twitter saksaha_team 0xa24a13edff2f3109c996cf5d9889f9e30c6a0024039eb24056b5bc6b7bb861f3";

    let crawler = Crawler::init().unwrap();

    twitter::scrape_tweet(&crawler, tweet_url, twitter_handle)
        .await
        .unwrap();
}
