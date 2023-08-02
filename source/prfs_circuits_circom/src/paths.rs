use colored::Colorize;
use lazy_static::lazy_static;
use std::path::PathBuf;

lazy_static! {
    pub static ref PATHS: Paths = Paths::new();
}

#[derive(Debug)]
pub struct Paths {
    pub manifest_dir: PathBuf,
    pub circuits: PathBuf,
    pub build: PathBuf,
}

impl Paths {
    pub fn new() -> Paths {
        let manifest_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
        let circuits = manifest_dir.join("circuits");
        let build = manifest_dir.join("build");

        let p = Paths {
            manifest_dir,
            circuits,
            build,
        };

        println!(
            "{} paths, pkg: {}, Paths: {:#?}",
            "Loaded".green(),
            env!("CARGO_PKG_NAME"),
            p
        );

        p
    }
}
