use super::json::DriversJson2;
use crate::paths::PATHS;

pub fn load_system_native_driver_types() -> DriversJson2 {
    let drivers_json_path = PATHS.data.join("drivers.json");
    let b = std::fs::read(&drivers_json_path)
        .expect(&format!("file not exists, {:?}", drivers_json_path));
    let drivers_json: DriversJson2 = serde_json::from_slice(&b).unwrap();

    return drivers_json;
}
