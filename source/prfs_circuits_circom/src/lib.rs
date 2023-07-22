pub mod builder;
pub mod paths;

use paths::PATHS;
use std::path::PathBuf;

pub type CircuitsError = Box<dyn std::error::Error + Sync + Send>;

pub fn get_build_fs_path() -> PathBuf {
    PATHS.build.clone()
}
