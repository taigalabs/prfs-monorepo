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

        let manifest_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
        println!("manifest_dir: {:?}", manifest_dir);

        let assets = manifest_dir.join("assets");
        println!("assets: {:?}", assets);

        let assets_local = manifest_dir.join("assets/local");
        println!("assets_local: {:?}", assets);

        Paths {
            assets,
            assets_local,
        }
    }
}
