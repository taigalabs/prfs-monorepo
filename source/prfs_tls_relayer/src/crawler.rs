// use headless_chrome::{Browser, LaunchOptions};

// use crate::WebScraperError;

// #[deprecated]
// pub struct Crawler {
//     pub browser: Browser,
// }

// impl Crawler {
//     pub fn init() -> Result<Crawler, WebScraperError> {
//         let browser = Browser::new(
//             LaunchOptions::default_builder()
//                 .build()
//                 .expect("Could not find chrome-executable"),
//         )?;

//         let c = Crawler { browser };

//         Ok(c)
//     }
// }
