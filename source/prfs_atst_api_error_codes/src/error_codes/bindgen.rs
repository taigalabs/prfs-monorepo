use std::fs;

use crate::{error_codes::PRFS_ATST_API_ERROR_CODES, paths::PATHS, PrfsAtstApiErrorCodesError};

pub fn make_prfs_atst_api_error_code_json_binding() -> Result<(), PrfsAtstApiErrorCodesError> {
    let json = serde_json::to_string_pretty(&PRFS_ATST_API_ERROR_CODES.clone()).unwrap();
    println!(
        "{} \
        Successfully loaded error codes to generate json binding",
        env!("CARGO_PKG_NAME"),
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
