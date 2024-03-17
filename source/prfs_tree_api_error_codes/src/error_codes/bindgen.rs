use std::fs;

use crate::{error_codes::PRFS_ID_API_ERROR_CODES, paths::PATHS, PrfsIdApiErrorCodesError};

pub fn make_prfs_tree_api_error_code_json_binding() -> Result<(), PrfsIdApiErrorCodesError> {
    let json = serde_json::to_string_pretty(&PRFS_ID_API_ERROR_CODES.clone()).unwrap();
    println!(
        "[prfs_id_api_error_codes] \
        Successfully loaded error codes to generate json binding"
    );

    let file_path = PATHS.bindings.join("error_codes.json");

    println!("Cleaning up directory at {:?}", &PATHS.bindings);
    if PATHS.bindings.exists() {
        fs::remove_dir_all(&PATHS.bindings).unwrap();
    }
    fs::create_dir(&PATHS.bindings).unwrap();

    println!("Creating json binding at {:?}", file_path);
    fs::write(file_path, json).unwrap();

    Ok(())
}
