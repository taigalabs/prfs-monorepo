use lazy_static::lazy_static;
use std::path::PathBuf;

lazy_static! {
    pub static ref PATHS: Paths = Paths::new();
}

pub struct Paths {
    pub manifest_dir: PathBuf,
    pub circuits: PathBuf,
    pub build: PathBuf,
}

impl Paths {
    pub fn new() -> Paths {
        println!("Initializing {} paths...", env!("CARGO_PKG_NAME"));

        let manifest_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
        println!("manifest_dir: {:?}", manifest_dir);

        let circuits = manifest_dir.join("circuits");
        println!("circuits path: {:?}", circuits);

        let build = manifest_dir.join("build");
        println!("build path: {:?}", build);

        Paths {
            manifest_dir,
            circuits,
            build,
        }
    }
}
