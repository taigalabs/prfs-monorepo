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
    pub data_seed: PathBuf,
    pub data_api: PathBuf,

    pub data_seed__json_bindings: PathBuf,
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
        let data_seed = manifest_dir.join("data_seed");
        let data_api = manifest_dir.join("data_api");

        #[allow(non_snake_case)]
        let data_seed__json_bindings = manifest_dir.join("data_seed/json_bindings");

        let p = Paths {
            workspace_dir,
            manifest_dir,
            data_seed,
            data_seed__json_bindings,
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
