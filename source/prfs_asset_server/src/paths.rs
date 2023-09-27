use colored::Colorize;
use lazy_static::lazy_static;
use std::path::{Path, PathBuf};

lazy_static! {
    pub static ref PATHS: Paths = Paths::new();
}

#[derive(Debug)]
pub struct Paths {
    pub assets: PathBuf,
    pub assets_circuits: PathBuf,
    pub assets_drivers: PathBuf,
    pub ws_prfs_driver_spartan_js: PathBuf,
}

impl Paths {
    pub fn new() -> Paths {
        let manifest_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
        let assets = manifest_dir.join("assets");

        let assets_circuits = manifest_dir.join("assets/circuits");
        let assets_drivers = manifest_dir.join("assets/drivers");

        let workspace = workspace_dir();
        let ws_prfs_driver_spartan_js = workspace.join("source/prfs_driver_spartan_js");

        let p = Paths {
            assets,
            assets_circuits,
            assets_drivers,
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

fn workspace_dir() -> PathBuf {
    let output = std::process::Command::new(env!("CARGO"))
        .arg("locate-project")
        .arg("--workspace")
        .arg("--message-format=plain")
        .output()
        .unwrap()
        .stdout;
    let cargo_path = Path::new(std::str::from_utf8(&output).unwrap().trim());
    cargo_path.parent().unwrap().to_path_buf()
}
