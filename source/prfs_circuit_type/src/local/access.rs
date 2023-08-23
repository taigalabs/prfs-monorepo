use super::json::{CircuitInputTypesJson2, CircuitTypesJson2};
use crate::paths::PATHS;

pub fn load_system_native_circuit_types() -> CircuitTypesJson2 {
    let drivers_json_path = PATHS.data.join("circuit_types.json");
    let b = std::fs::read(&drivers_json_path)
        .expect(&format!("file not exists, {:?}", drivers_json_path));
    let json = serde_json::from_slice(&b).unwrap();

    return json;
}

pub fn load_system_native_circuit_input_types() -> CircuitInputTypesJson2 {
    let input_types_json_path = PATHS.data.join("circuit_input_types.json");
    let b = std::fs::read(&input_types_json_path)
        .expect(&format!("file not exists, {:?}", input_types_json_path));
    let json = serde_json::from_slice(&b).unwrap();

    return json;
}
