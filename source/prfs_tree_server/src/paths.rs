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
    pub project_root: PathBuf,
    pub package_root: PathBuf,
}

impl Paths {
    pub fn new() -> Paths {
        let project_root = get_project_root();
        let package_root = project_root.join("source/prfs_tree_server");

        let p = Paths {
            project_root,
            package_root,
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
