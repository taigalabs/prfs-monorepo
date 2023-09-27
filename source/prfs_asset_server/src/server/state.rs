use hyper_staticfile::Static;

use crate::{envs::ENVS, paths::PATHS};

pub struct ServerState {
    pub static_serve: Static,
    pub driver_asset_urls: Vec<String>,
}

impl ServerState {
    pub fn init() -> ServerState {
        let static_serve = Static::new(&PATHS.assets);
        // state.driver_asset_urls
        // ENVS.asset_server_endpoint;

        let drivers_path = std::fs::read_dir(&PATHS.assets_drivers).unwrap();

        for fd in drivers_path {
            let fd = fd.unwrap().path();
            println!("111, fd: {:?}", fd);
        }

        ServerState {
            static_serve,
            driver_asset_urls: vec![],
        }
    }
}
