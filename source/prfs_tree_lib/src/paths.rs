use colored::Colorize;
use lazy_static::lazy_static;
use project_root::get_project_root;
use std::path::PathBuf;

lazy_static! {
    pub static ref PATHS: Paths = Paths::new();
}

#[derive(Debug)]
pub struct Paths {
    pub log_files: PathBuf,
    pub data: PathBuf,
    pub data_sets: PathBuf,
    pub data_scans: PathBuf,
}

impl Paths {
    pub fn new() -> Paths {
        let project_root = get_project_root();
        let package_root = project_root.join("source/prfs_tree_lib");
        let log_files = package_root.join("log_files");
        let data = package_root.join("data");
        let data_scans = package_root.join("data/scans");
        let data_sets = package_root.join("data/sets");

        let p = Paths {
            log_files,
            data,
            data_scans,
            data_sets,
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
