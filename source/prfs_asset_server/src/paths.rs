use colored::Colorize;
use lazy_static::lazy_static;
use project_root::get_project_root;
use std::path::PathBuf;

lazy_static! {
    pub static ref PATHS: Paths = Paths::new();
}

#[derive(Debug)]
pub struct Paths {
    pub package_root: PathBuf,
    pub assets: PathBuf,
    pub assets_circuits: PathBuf,
    pub ws_prfs_driver_spartan_js: PathBuf,
}

impl Paths {
    pub fn new() -> Paths {
        let project_root = get_project_root();

        let package_root = project_root.join("source/prfs_asset_server");
        let assets = project_root.join("source/prfs_asset_server/assets");
        let assets_circuits = assets.join("assets/circuits");
        let ws_prfs_driver_spartan_js = project_root.join("source/prfs_driver_spartan_js");

        let p = Paths {
            package_root,
            assets,
            assets_circuits,
            ws_prfs_driver_spartan_js,
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
