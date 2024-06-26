use crate::seed::data::get_shy_channels_seed;
use prfs_db_driver::database2::Database2;
use prfs_db_driver::sqlx::types::Json as JsonType;
use prfs_rust_utils::serde::read_json_file;
use shy_db_interface::shy;
use std::process::Command;
use tokio::sync::OnceCell;

use crate::{envs::ENVS, paths::PATHS};

static ONCE: OnceCell<u32> = OnceCell::const_new();
const NODE_PKG_MANAGER: &str = "pnpm";

async fn _prepare() {
    ONCE.get_or_init(|| async {
        let status = Command::new(NODE_PKG_MANAGER)
            .current_dir(&PATHS.package_root)
            .args(["run", "create-bindings"])
            .status()
            .expect(&format!("{} command failed to start", NODE_PKG_MANAGER));

        assert!(status.success());

        return 1;
    })
    .await;
}

async fn get_db() -> Database2 {
    let db2 = {
        let pg_endpoint = &ENVS.postgres_endpoint;
        let pg_username = &ENVS.postgres_username;
        let pg_pw = &ENVS.postgres_pw;

        let db2 = Database2::connect(pg_endpoint, pg_username, pg_pw)
            .await
            .unwrap();
        db2
    };

    db2
}

mod seed_api1 {
    use super::*;

    #[tokio::test]
    async fn seed_shy_channels_1() {
        let db = get_db().await;
        let pool = &db.pool;
        let mut tx = pool.begin().await.unwrap();

        let channels = get_shy_channels_seed();
        println!("ch: {:#?}", channels);

        for ch in channels {
            shy::upsert_shy_channel(&mut tx, &ch).await.unwrap();
        }

        tx.commit().await.unwrap();
    }
}
