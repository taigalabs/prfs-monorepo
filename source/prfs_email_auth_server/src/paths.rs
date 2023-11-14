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
    pub data: PathBuf,
    pub access_token: PathBuf,

    pub data__json_bindings: PathBuf,
}

impl Paths {
    pub fn new() -> Paths {
        let manifest_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
        let data = manifest_dir.join("data");
        let workspace_dir = manifest_dir
            .parent()
            .unwrap()
            .parent()
            .unwrap()
            .to_path_buf();

        #[allow(non_snake_case)]
        let data__json_bindings = manifest_dir.join("data/json_bindings");

        let access_token = manifest_dir.join("prfs_auth_access_token");

        let p = Paths {
            workspace_dir,
            manifest_dir,
            access_token,
            data,
            data__json_bindings,
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
