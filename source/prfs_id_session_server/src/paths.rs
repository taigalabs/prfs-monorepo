use colored::Colorize;
use lazy_static::lazy_static;
use std::path::PathBuf;

lazy_static! {
    pub static ref PATHS: Paths = Paths::new();
}

#[allow(non_snake_case)]
#[derive(Debug)]
pub struct Paths {
    pub workspace_dir: PathBuf,
    pub manifest_dir: PathBuf,
    pub data_api: PathBuf,
}

impl Paths {
    pub fn new() -> Paths {
        let manifest_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
        let workspace_dir = manifest_dir
            .parent()
            .unwrap()
            .parent()
            .unwrap()
            .to_path_buf();
        let data_api = manifest_dir.join("data_api");

        let p = Paths {
            workspace_dir,
            manifest_dir,
            data_api,
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
