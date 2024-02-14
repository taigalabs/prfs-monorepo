use colored::Colorize;
use hyper_staticfile::Static;

use crate::{envs::ENVS, paths::PATHS};

#[derive(Clone)]
pub struct ServerState {
    pub static_serve: Static,
}

impl ServerState {
    pub fn init() -> ServerState {
        let static_serve = Static::new(&PATHS.assets);

        ServerState { static_serve }
    }
}
