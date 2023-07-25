mod climb;
mod create;
mod json;
mod leaf;

use clap::ArgMatches;
use prfs_db_interface::database::Database;

pub async fn create_set(_sub_matches: &ArgMatches) {
    let pg_endpoint = std::env::var("POSTGRES_ENDPOINT").unwrap();
    let pg_pw = std::env::var("POSTGRES_PW").unwrap();
    let db = Database::connect(pg_endpoint, pg_pw).await.unwrap();

    let set_json_path = std::env::var("SET_JSON_PATH").unwrap();
    let set_json = json::require_set_json(set_json_path);

    // create::create_set(&db, &set_json).await.unwrap();
    // leaf::create_leaves_without_offset(&db, &set_json)
    //     .await
    //     .unwrap();

    climb::create_tree_nodes(&db, &set_json).await.unwrap();
}
