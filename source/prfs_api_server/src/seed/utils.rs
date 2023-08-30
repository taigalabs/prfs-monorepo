use serde::de::DeserializeOwned;
use std::path::PathBuf;

pub fn read_json<T>(json_path: &PathBuf) -> T
where
    T: DeserializeOwned,
{
    let b = std::fs::read(&json_path).expect(&format!("file not exists, {:?}", json_path));
    let json: T = serde_json::from_slice(&b).unwrap();
    json
}
