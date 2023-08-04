use super::json::DriversJson;
use crate::paths::PATHS;

pub fn load_system_native_driver_types() -> DriversJson {
    let drivers_json_path = PATHS.data.join("drivers.json");
    let b = std::fs::read(&drivers_json_path)
        .expect(&format!("file not exists, {:?}", drivers_json_path));
    let drivers_json: DriversJson = serde_json::from_slice(&b).unwrap();

    return drivers_json;
}
