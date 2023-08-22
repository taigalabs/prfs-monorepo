use chrono::DateTime;
use chrono::Utc;
use colored::Colorize;
use prfs_api_server::envs::ENVS;
use prfs_api_server::seed;
use prfs_api_server::seed::Endpoint;
use prfs_api_server::ApiServerError;
use prfs_db_interface::database2::Database2;
use prfs_db_interface::db_apis;
use prfs_entities::entities::PrfsSet;
use prfs_entities::entities::PrfsTreeNode;
use prfs_entities::sqlx;
use prfs_entities::sqlx::Row;
use std::path::PathBuf;
use uuid::uuid;

#[tokio::main]
async fn main() -> Result<(), ApiServerError> {
    println!("Starting backend seeding...");

    seed::upload(Endpoint::Local).await;

    Ok(())
}

async fn _temp_migrate() {
    println!("{} {}...", "Starting".green(), env!("CARGO_PKG_NAME"));

    ENVS.check();

    let manifest_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    println!("manifest_dir: {:?}", manifest_dir);

    // let local_assets = local::load_local_assets();

    let pg_endpoint = &ENVS.postgres_endpoint;
    let pg_username = &ENVS.postgres_username;
    let pg_pw = &ENVS.postgres_pw;

    let db2 = Database2::connect(pg_endpoint, pg_username, pg_pw)
        .await
        .unwrap();

    let pool = &db2.pool;
    let mut tx = pool.begin().await.unwrap();

    let query = format!("SELECT * from prfs_tree_nodes where set_id='eth_1.0_2.0'");

    let rows = sqlx::query(&query).fetch_all(pool).await.unwrap();
    println!("retrieved row count: {}", rows.len());

    let mut nodes = vec![];
    for row in rows {
        let pos_w = row.try_get("pos_w").expect("pos_w should exist");
        let pos_h = row.try_get("pos_h").expect("pos_h should exist");
        let val = row.try_get("val").expect("val should exist");
        let set_id = row.try_get("set_id").expect("set_id should exist");
        // let set_id2 = uuid!("00000000-0000-0000-0000-000000000003");

        let node = PrfsTreeNode {
            pos_w,
            pos_h,
            val,
            set_id,
            // set_id2,
        };

        // println!("node: {:?}", node);

        nodes.push(node);
    }

    let rows_affected = db_apis::insert_prfs_tree_nodes(&mut tx, &nodes, true)
        .await
        .unwrap();

    tx.commit().await.unwrap();

    println!("Rows affected: {}", rows_affected);
}
