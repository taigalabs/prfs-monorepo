use headless_chrome::{Browser, LaunchOptions};
use prfs_entities::atst_api_entities::TwitterAccValidation;
use regex::Regex;

use crate::WebScraperError;

pub async fn scrape_tweet(
    tweet_url: &str,
    twitter_handle: &str,
) -> Result<TwitterAccValidation, WebScraperError> {
    println!("scrape tweet, url: {}", tweet_url);
    let mut res = TwitterAccValidation {
        atst_type: String::from(""),
        dest: String::from(""),
        account_id: String::from(""),
        cm: String::from(""),
        username: String::from(""),
        avatar_url: String::from(""),
        document_url: String::from(tweet_url),
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
        let (_, [_, atst_type, dest, account_id, cm]) = re.captures(&str).unwrap().extract();

        // println!("atst_type: {}, dest: {}, id: {}, cm: {}", atst_type, dest, id, cm);
        res.atst_type = atst_type.to_string();
        res.dest = dest.to_string();
        res.account_id = account_id.to_string();
        res.cm = cm.to_string();
    }

    {
        // Extract a username and an avatar URL
        let elems = tab.find_elements(&anchor_selector).unwrap();
        for el in elems {
            let spans = el.find_elements("span").unwrap();
            for span in spans {
                let text = span.get_inner_text().unwrap();
                if text.len() > 0 && text.starts_with("@") {
                    // println!("t: {}, {}", text, twitter_handle == &text[1..]);
                    if twitter_handle == &text[1..] {
                        // println!("twitter_handle, {}", twitter_handle);
                    } else {
                        return Err(format!(
                            "Twitter handle does not match attested id, id: {}, handle: {}",
                            &text[1..],
                            twitter_handle,
                        )
                        .into());
                    }
                }

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
