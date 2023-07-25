use lazy_static::lazy_static;
use std::path::PathBuf;

lazy_static! {
    pub static ref PATHS: Paths = Paths::new();
}

pub struct Paths {
    manifest_dir: PathBuf,
    pub log_files: PathBuf,
    pub data: PathBuf,
}

impl Paths {
    pub fn new() -> Paths {
        println!("Initializing {} paths...", env!("CARGO_PKG_NAME"));

        let manifest_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
        println!("manifest_dir: {:?}", manifest_dir);

        let log_files = manifest_dir.join("log_files");
        println!("log_files: {:?}", log_files);

        let data = manifest_dir.join("data");
        println!("data: {:?}", data);

        Paths {
            manifest_dir,
            log_files,
            data,
        }
    }
}
