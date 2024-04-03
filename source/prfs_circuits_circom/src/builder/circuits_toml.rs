use colored::Colorize;
use prfs_circuit_interface::circuit_types::CircuitTypeId;
use serde::{Deserialize, Serialize};

use crate::{paths::PATHS, CircuitsError};

#[derive(Debug, Serialize, Deserialize, PartialEq)]
pub struct CircuitsToml {
    circuit_type_ids: Vec<CircuitTypeId>,
}

pub fn read_circuits_toml() -> Result<CircuitsToml, CircuitsError> {
    let circuits_toml_path = PATHS.package_root.join("circuits.toml");

    match std::fs::read_to_string(&circuits_toml_path) {
        Ok(str) => {
            println!(
                "{} ci.toml at: {:?}, parsing",
                "Found".green(),
                circuits_toml_path,
            );

            let t = toml::from_str::<CircuitsToml>(&str)?;

            return Ok(t);
        }
        Err(err) => return Err(err.into()),
    }
}
