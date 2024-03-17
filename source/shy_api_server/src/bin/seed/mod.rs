mod seed;

use prfs_db_driver::database2::Database2;
use prfs_db_driver::sqlx;
use prfs_tree_lib::envs::ENVS;
use seed::load_shy_channels;
use shy_api_server::ShyServerError;
use shy_db_interface::shy::{self};

#[tokio::main]
async fn main() -> Result<(), ShyServerError> {
    println!("Starting backend seeding...");

    let db = connect_db().await;
    upload(&db).await;
    Ok(())
}

pub async fn connect_db() -> Database2 {
    let endpoint = ENVS.postgres_endpoint.to_string();
    let username = ENVS.postgres_username.to_string();
    let pw = ENVS.postgres_pw.to_string();

    let db2 = Database2::connect(&endpoint, &username, &pw).await.unwrap();

    db2
}

async fn upload(db: &Database2) {
    let pool = &db.pool;
    let mut tx = pool.begin().await.unwrap();

    let shy_channels = load_shy_channels();
    println!("shy channels: {:#?}", shy_channels);

    sqlx::query("truncate table shy_channels restart identity")
        .execute(&mut *tx)
        .await
        .unwrap();

    for ch in shy_channels.values() {
        shy::insert_shy_channel(&mut tx, ch).await;
    }

    tx.commit().await.unwrap();
}
