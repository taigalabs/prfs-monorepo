use crate::AssetServerError;
use notify::RecursiveMode;
use serde::{Deserialize, Serialize};
use std::{path::PathBuf, sync::Arc};
use tokio::sync::mpsc;

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
        //

        let a = AssetStatus {};

        Ok(a)
    }
}

pub struct AssetStatusWatcher;

impl AssetStatusWatcher {
    pub fn run(asset_status: Arc<Mutex<AssetStatus>>) -> Result<(), AssetServerError> {
        // AssetStatusWatcher {}

        let mut watcher = notify::recommended_watcher(move |res| match res {
            Ok(event) => {
                println!("ev: {:?}", event);

                build_watch_tx.send(1).unwrap();

                // let status = asset_status.clone().lock().await;
            }
            Err(err) => println!("Error: {:?}", err),
        })?;

        watcher.watch(&build_json_path, RecursiveMode::Recursive)?;

        Ok(())
    }
}
