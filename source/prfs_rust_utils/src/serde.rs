use serde::de::DeserializeOwned;
use std::path::PathBuf;

use crate::RustUtilsError;

pub fn read_json_file<T>(json_path: &PathBuf) -> Result<T, RustUtilsError>
where
    T: DeserializeOwned,
{
    let b = std::fs::read(&json_path)
        .map_err(|_err| format!("file not exists, {:?}", json_path.to_owned()))?;

    let json: T = serde_json::from_slice(&b)?;

    Ok(json)
}

pub fn read_file_to_str(path: &PathBuf) -> Result<String, RustUtilsError> {
    std::fs::read_to_string(path)
        .map_err(|err| format!("Couldn't read file, path: {:?}, err: {}", path, err).into())
}
