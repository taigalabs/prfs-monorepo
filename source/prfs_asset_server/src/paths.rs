use colored::Colorize;
use lazy_static::lazy_static;
use std::path::PathBuf;

lazy_static! {
    pub static ref PATHS: Paths = Paths::new();
}

#[derive(Debug)]
pub struct Paths {
    pub assets: PathBuf,
}

impl Paths {
    pub fn new() -> Paths {
        let manifest_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
        let assets = manifest_dir.join("assets");

        let p = Paths { assets };

        println!(
            "{} paths, pkg: {}, Paths: {:#?}",
            "Loaded".green(),
            env!("CARGO_PKG_NAME"),
            p
        );

        p
    }
}
