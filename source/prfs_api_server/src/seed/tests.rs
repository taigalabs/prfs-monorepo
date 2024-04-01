use prfs_db_driver::database2::Database2;
use std::sync::Arc;

use super::upload::{upload_prfs_circuits, upload_prfs_proof_types};
use crate::envs::ENVS;

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

#[tokio::test]
async fn seed_prfs_circuits() {
    let db = get_db().await;

    upload_prfs_circuits(&db).await;
}

#[tokio::test]
async fn seed_prfs_proof_types() {
    let db = get_db().await;

    upload_prfs_proof_types(&db).await;
}
