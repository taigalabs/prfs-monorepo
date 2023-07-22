use lazy_static::lazy_static;
use std::path::PathBuf;

lazy_static! {
    pub static ref PATHS: Paths = Paths::new();
}

pub struct Paths {
    pub assets: PathBuf,
    pub assets_local: PathBuf,
}

impl Paths {
    pub fn new() -> Paths {
        println!("Initializing {} paths...", env!("CARGO_PKG_NAME"));

        let curr_dir = std::env::current_dir().unwrap();
        println!("curr_dir: {:?}", curr_dir);

        let assets = curr_dir.join("assets");
        println!("assets: {:?}", assets);

        let assets_local = curr_dir.join("assets/local");
        println!("assets_local: {:?}", assets);

        Paths {
            assets,
            assets_local,
        }
    }
}
