mod asset_status;
mod router;

use crate::router::make_router;
use asset_status::{AssetStatus, AssetStatusWatcher};
use hyper::Server;
use notify::{RecommendedWatcher, RecursiveMode, Watcher};
use routerify::RouterService;
use std::{net::SocketAddr, path::PathBuf, sync::Arc};
use tokio::select;
use tokio::sync::mpsc;
use tokio::sync::Mutex;

pub type AssetServerError = Box<dyn std::error::Error + Sync + Send>;

#[tokio::main]
async fn main() -> Result<(), AssetServerError> {
    let curr_dir = std::env::current_dir().unwrap();
    println!("curr_dir: {:?}", curr_dir);

    let assets_path = curr_dir.join("source/prfs_prf_asset_server/assets");
    println!("assets_path: {:?}", assets_path);

    assert!(assets_path
        .try_exists()
        .expect("assets path should exist in the file system"));

    let (build_watch_tx, build_watch_rx) = {
        let (tx, rx) = mpsc::unbounded_channel::<usize>();
        (Arc::new(tx), rx)
    };

    let build_watch_proc = run_build_status_watch_loop(build_watch_rx);

    let asset_status = {
        let s = AssetStatus::new(&assets_path)?;
        Arc::new(Mutex::new(s))
    };

    let build_status_watcher = AssetStatusWatcher::run();

    let build_json_path = assets_path.join("build_circuits.json");

    let router = make_router(asset_status, &assets_path);

    let service = RouterService::new(router).unwrap();
    let addr: SocketAddr = ([127, 0, 0, 1], 4010).into();
    let server = Server::bind(&addr).serve(service);

    select! {
        _ = build_watch_proc => {
            println!("operation timed out");
            // break;
        }
        _ = server => {
            println!("operation completed");
        }
    }

    // println!("Server is running on: {}", addr);

    // if let Err(err) = server.await {
    //     eprintln!("Server error: {}", err);
    // }

    Ok(())
}

async fn run_build_status_watch_loop(mut rx: mpsc::UnboundedReceiver<usize>) {
    while let Some(res) = rx.recv().await {}
}
