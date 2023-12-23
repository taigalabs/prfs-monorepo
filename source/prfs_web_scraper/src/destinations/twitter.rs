use headless_chrome::{Browser, LaunchOptions};

use crate::WebScraperError;

pub async fn scrape_tweet(tweet_url: String) -> Result<(), WebScraperError> {
    println!("scrape tweet, url: {}", tweet_url);

    let browser = Browser::new(
        LaunchOptions::default_builder()
            .build()
            .expect("Could not find chrome-executable"),
    )?;
    let tab = browser.new_tab()?;
    tab.navigate_to(&tweet_url).expect("navigate");

    println!("navigated");

    // let content = tab.get_content().unwrap();
    // println!("content: {}", content);

    let elems = tab
        .wait_for_elements(r#"[data-testid="tweetText"]"#)
        .expect("wait for search input");

    println!("elems: {:?}", elems);

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
