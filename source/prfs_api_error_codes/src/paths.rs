use colored::Colorize;
use lazy_static::lazy_static;
use std::path::PathBuf;

lazy_static! {
    pub static ref PATHS: Paths = Paths::new();
}

#[allow(non_snake_case)]
#[derive(Debug)]
pub struct Paths {
    pub bindings: PathBuf,
}

impl Paths {
    pub fn new() -> Paths {
        let ws_root = std::env::var("PRFS_WORKSPACE_ROOT").unwrap();
        let ws_path = PathBuf::from(ws_root);

        let bindings = ws_path.join("source/prfs_api_error_codes/bindings");

        let p = Paths { bindings };

        println!(
            "{} paths, pkg: {}, Paths: {:#?}",
            "Loaded".green(),
            env!("CARGO_PKG_NAME"),
            p
        );

        p
    }
}
