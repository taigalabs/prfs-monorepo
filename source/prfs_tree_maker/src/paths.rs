use std::path::PathBuf;

pub struct Paths {
    pub log_files: PathBuf,
}

impl Paths {
    pub fn new() -> Paths {
        let project_root = PathBuf::from(env!("CARGO_MANIFEST_DIR"));

        let log_files = project_root.join(format!("log_files"));
        println!("log files_path: {:?}", log_files);

        Paths { log_files }
    }
}
