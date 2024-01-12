use headless_chrome::{Browser, LaunchOptions};
use prfs_entities::atst_api_entities::TwitterAccValidation;
use regex::Regex;
use thiserror::Error;

use crate::TLSRelayError;

pub async fn fetch() -> Result<(), TLSRelayError> {
    println!("fetch()");

    Ok(())
}
