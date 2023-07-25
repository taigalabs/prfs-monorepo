use colored::Colorize;
use lazy_static::lazy_static;
use std::path::PathBuf;

lazy_static! {
    pub static ref PATHS: Paths = Paths::new();
}

#[derive(Debug)]
pub struct Paths {
    pub manifest_dir: PathBuf,
    pub log_files: PathBuf,
    pub sets: PathBuf,
    pub scan: PathBuf,
}

impl Paths {
    pub fn new() -> Paths {
        let manifest_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
        let log_files = manifest_dir.join("log_files");
        let scan = manifest_dir.join("scan");
        let sets = manifest_dir.join("sets");

        let p = Paths {
            manifest_dir,
            log_files,
            scan,
            sets,
        };

        println!(
            "{} paths for pkg {}, paths: {:#?}",
            "Loaded".green(),
            env!("CARGO_PKG_NAME"),
            p,
        );

        p
    }

    pub fn check(&self) {}
}
