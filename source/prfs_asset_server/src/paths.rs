use lazy_static::lazy_static;
use std::path::PathBuf;

lazy_static! {
    pub static ref PATHS: Paths = Paths::new();
}

pub struct Paths {
    pub project_dir: PathBuf,
    pub assets: PathBuf,
}

impl Paths {
    pub fn new() -> Paths {
        println!("Initializing paths...");

        let curr_dir = std::env::current_dir().unwrap();
        println!("curr_dir: {:?}", curr_dir);

        let project_dir = curr_dir.join("source/prfs_prf_asset_server");
        println!("project_dir: {:?}", project_dir);

        let assets = project_dir.join("assets");

        Paths {
            project_dir,
            assets,
        }
    }
}
