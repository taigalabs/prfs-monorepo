use colored::Colorize;
use hyper_staticfile::Static;

use crate::{envs::ENVS, paths::PATHS};

pub struct ServerState {
    pub static_serve: Static,
    pub driver_asset_urls: Vec<String>,
}

impl ServerState {
    pub fn init() -> ServerState {
        let static_serve = Static::new(&PATHS.assets);

        let drivers_path = std::fs::read_dir(&PATHS.assets_drivers).unwrap();

        let mut driver_asset_urls = vec![];

        for fd in drivers_path {
            let fd = fd.unwrap().path();
            let filename = fd.file_name();
            let f = format!(
                "{}/assets/drivers/{}",
                ENVS.asset_server_endpoint,
                filename.unwrap().to_str().unwrap()
            );

            println!("{} driver asset: {}", "Loading".green(), f);

            driver_asset_urls.push(f);
        }

        ServerState {
            static_serve,
            driver_asset_urls,
        }
    }
}
