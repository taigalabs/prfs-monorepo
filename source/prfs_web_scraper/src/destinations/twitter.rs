use headless_chrome::{Browser, LaunchOptions};
use prfs_entities::atst_api::TwitterAccValidation;
use regex::Regex;
use thiserror::Error;

use crate::WebScraperError;

#[derive(Error, Debug)]
pub enum TweetScrapeError {
    #[error("cannot open new tab")]
    NewTabError,

    #[error("attestation is of the wrong form")]
    AttestationWrongForm,

    #[error("attestation doesn't match with ID")]
    IDNotMatchAttestation,

    #[error("Close failed")]
    CloseFailed,
}

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

    let tab = browser.new_tab().map_err(|err| {
        println!("Cannot open new tab, err: {}", err);
        TweetScrapeError::NewTabError
    })?;
    tab.navigate_to(&tweet_url).expect("navigate");

    let anchor_selector = format!(r#"a[href^="/{}"]"#, twitter_handle);
    match tab.wait_for_elements(&anchor_selector) {
        Ok(_) => {}
        Err(_err) => {
            println!(
                "{} doesn't seem to load, but let's still try to parse the doc",
                anchor_selector
            );
        }
    };

    println!("waited element to render, selector: {}", anchor_selector);

    {
        // Extact commitments
        let str = tab.get_content().expect("anchor content should be found");
        let (_, [_, atst_type, dest, account_id, cm]) = re
            .captures(&str)
            .ok_or(TweetScrapeError::AttestationWrongForm)?
            .extract();

        // println!("atst_type: {}, dest: {}, id: {}, cm: {}", atst_type, dest, id, cm);
        res.atst_type = atst_type.to_string();
        res.dest = dest.to_string();
        res.account_id = account_id.to_string();
        res.cm = cm.to_string();
    }

    {
        // Extract a username and an avatar URL
        let elems = tab
            .find_elements(&anchor_selector)
            .expect("username should be found");

        for el in elems {
            let spans = el.find_elements("span").unwrap();
            for span in spans {
                let text = span.get_inner_text().unwrap();
                if text.len() > 0 && text.starts_with("@") {
                    // println!("t: {}, {}", text, twitter_handle == &text[1..]);
                    if twitter_handle == &text[1..] {
                        // println!("twitter_handle, {}", twitter_handle);
                    } else {
                        return Err(TweetScrapeError::IDNotMatchAttestation.into());
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
