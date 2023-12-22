use headless_chrome::{Browser, LaunchOptions};
use http_body_util::{BodyExt, Empty};
use hyper_tls::HttpsConnector;
use hyper_util::client::legacy::Client;
use hyper_util::rt::{TokioExecutor, TokioIo};
use hyper_utils::io::{empty, parse_req, ApiHandlerResult, BytesBoxBody};
use hyper_utils::resp::ApiResponse;
use hyper_utils::ApiHandleError;
use scraper::Html;
use std::path::PathBuf;
use std::sync::Arc;
use tokio::io::AsyncWriteExt;
use tokio::net::TcpStream;

use crate::WebScraperError;

pub async fn scrape_tweet(tweet_url: String) -> Result<(), WebScraperError> {
    // let url = "https://twitter.com/elonmusk";
    // let url = url.parse::<hyper::Uri>().unwrap();

    println!("11");
    let input = "Elvis Aaron Presley";
    let browser = Browser::new(
        LaunchOptions::default_builder()
            .build()
            .expect("Could not find chrome-executable"),
    )?;
    let tab = browser.new_tab()?;
    tab.navigate_to("https://en.wikipedia.org")
        .expect("navigate");

    println!("naviated");

    let elem = tab
        .wait_for_element("input#searchInput")
        .expect("wait for search input");

    println!("elem: {:?}", elem);

    let str = elem.get_content().unwrap();
    println!("elem str: {:?}", str);

    elem.click().expect("clicked");

    println!("clicked");

    tab.type_str(input)?.press_key("Enter")?;

    match tab.wait_for_element("div.shortdescription") {
        Err(e) => eprintln!("Query failed: {e:?}"),
        Ok(e) => match e.get_description()?.find(|n| n.node_name == "#text") {
            Some(n) => println!("Result for `{}`: {}", &input, n.node_value),
            None => eprintln!("No shortdescription-node found on page"),
        },
    }

    Ok(())
}
