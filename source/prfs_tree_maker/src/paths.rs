use std::path::PathBuf;

pub struct Paths {
    pub log_files: PathBuf,
    pub data: PathBuf,
}

impl Paths {
    pub fn new() -> Paths {
        let project_root = PathBuf::from(env!("CARGO_MANIFEST_DIR"));

        let log_files = project_root.join("log_files");
        println!("log_files: {:?}", log_files);

        let data = project_root.join("data");
        println!("data: {:?}", data);

        Paths { log_files, data }
    }
}
