use colored::Colorize;
use lazy_static::lazy_static;
use project_root::get_project_root;
use std::path::PathBuf;

lazy_static! {
    pub static ref PATHS: Paths = Paths::new();
}

#[allow(non_snake_case)]
#[derive(Debug)]
pub struct Paths {
    pub package_root: PathBuf,
    pub data_seed: PathBuf,
    pub data_seed__json_bindings: PathBuf,
}

impl Paths {
    pub fn new() -> Paths {
        let project_root = get_project_root();
        let package_root = project_root.join("source/prfs_api_server");

        let data_seed = project_root.join("source/prfs_api_server/data_seed");
        #[allow(non_snake_case)]
        let data_seed__json_bindings = data_seed.join("json_bindings");

        let p = Paths {
            package_root,
            data_seed,
            data_seed__json_bindings,
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
