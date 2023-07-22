use lazy_static::lazy_static;
use std::path::PathBuf;

lazy_static! {
    pub static ref PATHS: Paths = Paths::new();
}

pub struct Paths {
    pub assets: PathBuf,
}

impl Paths {
    pub fn new() -> Paths {
        println!("Initializing paths...");

        let curr_dir = std::env::current_dir().unwrap();
        println!("curr_dir: {:?}", curr_dir);

        let assets = curr_dir.join("assets");
        println!("assets: {:?}", assets);

        Paths { assets }
    }
}
