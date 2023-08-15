use super::json::CircuitTypesJson;
use crate::paths::PATHS;

pub fn load_system_native_circuit_types() -> CircuitTypesJson {
    let drivers_json_path = PATHS.data.join("circuit_types.json");
    let b = std::fs::read(&drivers_json_path)
        .expect(&format!("file not exists, {:?}", drivers_json_path));
    let drivers_json = serde_json::from_slice(&b).unwrap();

    return drivers_json;
}
