use headless_chrome::{Browser, LaunchOptions};
use regex::Regex;

use crate::WebScraperError;

pub async fn scrape_tweet(tweet_url: String) -> Result<(), WebScraperError> {
    println!("scrape tweet, url: {}", tweet_url);

    let re = Regex::new(r"[\w]*[-][\w]*\s[\w]*\s[\w]*\s[\w]*").unwrap();
    let str = "atst-atst001 Twitter saksaha_team 0xa24a13edff2f3109c996cf5d9889f9e30c6a0024039eb24056b5bc6b7bb861f3";

    let t = re.captures(str).unwrap();
    println!("{:?}", t);

    let browser = Browser::new(
        LaunchOptions::default_builder()
            .build()
            .expect("Could not find chrome-executable"),
    )?;
    let tab = browser.new_tab()?;
    tab.navigate_to(&tweet_url).expect("navigate");

    let str = tab.get_content().unwrap();
    println!("str: {}", str);

    let elems = tab
        .wait_for_elements(r#"[data-testid="tweetText"]"#)
        .expect("wait for search input");

    for el in elems {
        let content = el.get_content().unwrap();
        println!("content: {:?}, val: {}", content, el.value);
    }

    // let str = elem.get_content().unwrap();
    // println!("elem str: {:?}", str);

    // elem.click().expect("clicked");

    // println!("clicked");

    // tab.type_str(input)?.press_key("Enter")?;

    // match tab.wait_for_element("div.shortdescription") {
    //     Err(e) => eprintln!("Query failed: {e:?}"),
    //     Ok(e) => match e.get_description()?.find(|n| n.node_name == "#text") {
    //         Some(n) => println!("Result for `{}`: {}", &input, n.node_value),
    //         None => eprintln!("No shortdescription-node found on page"),
    //     },
    // }

    Ok(())
}
