use colored::Colorize;
use prfs_circuits_circom::BuildJson;

pub struct LocalAssets {
    pub build_json: BuildJson,
}

pub fn load_local_assets() -> LocalAssets {
    let build_json = prfs_circuits_circom::access::read_build_json();

    LocalAssets { build_json }
}
