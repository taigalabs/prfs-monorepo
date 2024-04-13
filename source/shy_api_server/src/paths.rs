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
    pub data: PathBuf,
}

impl Paths {
    pub fn new() -> Paths {
        let project_root = get_project_root();
        let package_root = project_root.join("source/shy_api_server");

        let data = project_root.join("source/shy_api_server/data_seed");

        let p = Paths { package_root, data };

        println!(
            "{} paths, pkg: {}, Paths: {:#?}",
            "Loaded".green(),
            env!("CARGO_PKG_NAME"),
            p
        );

        p
    }
}
