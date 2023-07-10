use serde::{Deserialize, Serialize};

use crate::AssetServerError;
use std::path::PathBuf;

pub struct AssetStatus {}

#[derive(Serialize, Deserialize)]
pub struct BuildCircuitJson {}

impl AssetStatus {
    pub fn new(assets_path: &PathBuf) -> Result<AssetStatus, AssetServerError> {
        // let assets_path = PathBuf::
        let build_circuits_json_path = assets_path.join("build_circuits.json");

        let build_circuit_json =
            std::fs::read(build_circuits_json_path).expect("build_circuits_json should exist");

        // let build_circuit_json: BuildCircuitJson = serde_json::from_slice(&build_circuit_json)?;

        let a = AssetStatus {};

        Ok(a)
    }
}
