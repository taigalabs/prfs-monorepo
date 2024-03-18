use colored::Colorize;
use lazy_static::lazy_static;
use project_root::get_project_root;
use std::path::PathBuf;

lazy_static! {
    pub static ref PATHS: Paths = Paths::new();
}

#[derive(Debug)]
pub struct Paths {
    pub circuits: PathBuf,
    pub build: PathBuf,
    pub data: PathBuf,
    pub data_json_bindings: PathBuf,
    pub data_ts: PathBuf,
}

impl Paths {
    pub fn new() -> Paths {
        let project_root = get_project_root();
        let package_root = project_root.join("source/prfs_circuits_circom");
        let circuits = package_root.join("circuits");
        let build = package_root.join("build");

        let data = package_root.join("data");
        let data_ts = package_root.join("data/ts");
        let data_json_bindings = package_root.join("data/json_bindings");

        let p = Paths {
            circuits,
            build,
            data,
            data_ts,
            data_json_bindings,
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
