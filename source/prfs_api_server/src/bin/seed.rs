use chrono::DateTime;
use chrono::Utc;
use colored::Colorize;
use prfs_api_server::envs::ENVS;
use prfs_api_server::seed;
use prfs_api_server::seed::db::Endpoint;
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

    let db = seed::db::connect_db(Endpoint::Dev).await;

    seed::data::upload(db).await;

    Ok(())
}
