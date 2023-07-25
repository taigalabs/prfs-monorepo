use lazy_static::lazy_static;
use std::path::PathBuf;

lazy_static! {
    pub static ref PATHS: Paths = Paths::new();
}

pub struct Paths {
    pub manifest_dir: PathBuf,
    pub log_files: PathBuf,
    pub sets: PathBuf,
    pub scan: PathBuf,
}

impl Paths {
    pub fn new() -> Paths {
        println!("Initializing {} paths...", env!("CARGO_PKG_NAME"));

        let manifest_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
        println!("manifest_dir: {:?}", manifest_dir);

        let log_files = manifest_dir.join("log_files");
        println!("log_files: {:?}", log_files);

        let scan = manifest_dir.join("scan");
        println!("scan: {:?}", scan);

        let sets = manifest_dir.join("sets");
        println!("sets: {:?}", sets);

        Paths {
            manifest_dir,
            log_files,
            scan,
            sets,
        }
    }
}
