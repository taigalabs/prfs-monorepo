use headless_chrome::{Browser, LaunchOptions};
use regex::Regex;

use crate::WebScraperError;

pub struct TwitterScrapeResult {
    atst_type: String,
    dest: String,
    id: String,
    cm: String,
    twitter_handle: String,
    username: String,
    avatar_url: String,
}

pub async fn scrape_tweet(
    tweet_url: &str,
    twitter_handle: &str,
) -> Result<TwitterScrapeResult, WebScraperError> {
    // println!("scrape tweet, url: {}", tweet_url);
    let mut res = TwitterScrapeResult {
        atst_type: String::from(""),
        dest: String::from(""),
        id: String::from(""),
        cm: String::from(""),
        twitter_handle: String::from(twitter_handle),
        username: String::from(""),
        avatar_url: String::from(""),
    };

    let re = Regex::new(r"([\w]+)[-]([\w]+)\s([\w]+)\s([\w]+)\s([\w]+)").unwrap();

    let browser = Browser::new(
        LaunchOptions::default_builder()
            .build()
            .expect("Could not find chrome-executable"),
    )?;
    let tab = browser.new_tab()?;
    tab.navigate_to(&tweet_url).expect("navigate");

    let anchor_selector = format!(r#"a[href^="/{}"]"#, twitter_handle);
    tab.wait_for_elements(&anchor_selector)
        .expect("wait for search input");

    {
        // Exract commitments
        let str = tab.get_content().unwrap();
        let (_, [_, atst_type, dest, id, cm]) = re.captures(&str).unwrap().extract();

        res.atst_type = atst_type.to_string();
        res.dest = dest.to_string();
        res.id = id.to_string();
        res.cm = cm.to_string();
        // println!("atstType: {}, id: {}, cm: {}", atst_type, id, cm);
    }

    {
        // Extract a username and an avatar URL
        let elems = tab.find_elements(&anchor_selector).unwrap();
        for el in elems {
            let spans = el.find_elements("span").unwrap();
            for span in spans {
                let text = span.get_inner_text().unwrap();
                if text.len() > 0 && !text.starts_with("@") {
                    // println!("text: {}", text);
                    res.username = text.clone();
                }
            }

            let imgs = el.find_elements("img").unwrap();
            for img in imgs {
                let img_src = img.get_attribute_value("src").unwrap();
                if let Some(v) = img_src {
                    // println!("img_src: {:?}", v);
                    res.avatar_url = v.to_string();
                }
            }
        }
    }

    Ok(res)
}
