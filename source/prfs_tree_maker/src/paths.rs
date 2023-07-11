use std::path::PathBuf;

pub struct Paths {
    pub log_files: PathBuf,
    pub subsets: PathBuf,
}

impl Paths {
    pub fn new() -> Paths {
        let project_root = PathBuf::from(env!("CARGO_MANIFEST_DIR"));

        let log_files = project_root.join("log_files");
        println!("log_files: {:?}", log_files);

        let subsets = project_root.join("subsets");
        println!("subsets: {:?}", subsets);

        Paths { log_files, subsets }
    }
}
