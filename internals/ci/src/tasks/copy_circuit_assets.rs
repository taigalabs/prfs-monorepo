use crate::{build_status::BuildStatus, paths::Paths, task::Task, CiError};
use std::{env, fs};

pub struct CopyProofAssetsTask;

impl Task for CopyProofAssetsTask {
    fn name(&self) -> &str {
        "copy_circuit_assets"
    }

    fn run(&self, build_status: &mut BuildStatus, paths: &Paths) -> Result<(), CiError> {
        println!("\nCopying circuit assets...");

        // let curr_dir = env::current_dir().unwrap();
        // println!("curr_dir: {:?}", curr_dir);

        // let prfs_wasm_build_path = curr_dir.join("source/prfs_wasm/build");
        // println!("prfs_wasm_build_path: {:?}", prfs_wasm_build_path);

        {
            // let prf_asset_serve_path = prfs.curr_dir.join("source/prfs_prf_asset_server/assets");
            // println!("prf_asset_serve_path: {:?}", prf_asset_serve_path);

            let files_to_serve = ["prfs_wasm_bg.wasm"];

            for file in files_to_serve {
                let src_path = paths.wasm_build_path.join(file);
                let dest_path = paths.prf_asset_serve_path.join(file);
                println!("copying a file, src: {:?}, dest: {:?}", src_path, dest_path);

                fs::copy(&src_path, &dest_path).unwrap();
            }
        }

        Ok(())
    }
}
