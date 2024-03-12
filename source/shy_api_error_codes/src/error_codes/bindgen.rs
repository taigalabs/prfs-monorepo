use std::fs;
use std::path::PathBuf;

use crate::{error_codes::SHY_API_ERROR_CODES, paths::PATHS, ShyApiErrorCodesError};

pub fn make_shy_api_error_code_json_binding() -> Result<PathBuf, ShyApiErrorCodesError> {
    let json = serde_json::to_string_pretty(&SHY_API_ERROR_CODES.clone()).unwrap();
    println!(
        "[prfs_id_session_api_error_codes] \
        Successfully loaded error codes to generate json binding"
    );

    let file_path = PATHS.bindings.join("error_codes.json");

    println!("Cleaning up directory at {:?}", &PATHS.bindings);
    if PATHS.bindings.exists() {
        fs::remove_dir_all(&PATHS.bindings).unwrap();
    }
    fs::create_dir(&PATHS.bindings).unwrap();

    println!("Creating json binding at {:?}", file_path);
    fs::write(&file_path, json).unwrap();

    Ok(file_path)
}
