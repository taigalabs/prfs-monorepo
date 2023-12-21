use std::fs;

use crate::error_codes::API_ERROR_CODES;
use crate::paths::PATHS;
use crate::ApiServerError;

pub fn generate_error_code_json_binding() -> Result<(), ApiServerError> {
    let json = serde_json::to_string_pretty(&API_ERROR_CODES.clone()).unwrap();
    println!("Successfully loaded error codes to generate json binding");

    let file_path = PATHS.data_api.join("error_codes.json");

    println!("Cleaning up directory at {:?}", &PATHS.data_api);
    fs::remove_dir_all(&PATHS.data_api).unwrap();
    fs::create_dir(&PATHS.data_api).unwrap();

    println!("Creating json binding at {:?}", file_path);
    fs::write(file_path, json).unwrap();

    Ok(())
}
