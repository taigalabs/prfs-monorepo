use lazy_static::lazy_static;
use std::path::PathBuf;

lazy_static! {
    pub static ref PATHS: Paths = Paths::new();
}

pub struct Paths {
    pub curr_dir: PathBuf,
    pub circuits: PathBuf,
    pub build: PathBuf,
}

impl Paths {
    pub fn new() -> Paths {
        println!("Initializing {} paths...", env!("CARGO_PKG_NAME"));

        let curr_dir = std::env::current_dir().unwrap();
        println!("curr_dir: {:?}", curr_dir);

        let circuits = curr_dir.join("circuits");
        println!("circuits path: {:?}", circuits);

        let build = curr_dir.join("build");
        println!("build path: {:?}", build);

        Paths {
            curr_dir,
            circuits,
            build,
        }
    }
}
