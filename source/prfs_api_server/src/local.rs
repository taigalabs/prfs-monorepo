use colored::Colorize;
use prfs_circuits_circom::CircuitBuildJson;

pub struct LocalAssets {
    pub build_json: CircuitBuildJson,
}

pub fn load_local_assets() -> LocalAssets {
    let build_json = prfs_circuits_circom::access::read_circuit_build_json();

    LocalAssets { build_json }
}
