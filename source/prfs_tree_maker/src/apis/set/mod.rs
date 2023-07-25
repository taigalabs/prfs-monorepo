mod climb;
mod json;
mod leaf;
mod set;

use clap::ArgMatches;
use prfs_db_interface::database::Database;

pub async fn create_set(_sub_matches: &ArgMatches) {
    let pg_endpoint = std::env::var("POSTGRES_ENDPOINT").unwrap();
    let pg_pw = std::env::var("POSTGRES_PW").unwrap();
    let db = Database::connect(pg_endpoint, pg_pw).await.unwrap();

    let set_json_filename = std::env::var("SUBSET_JSON_FILENAME").unwrap();
    let set_json = json::require_set_json(set_json_filename);

    set::create_set(&db, &set_json).await.unwrap();
    leaf::create_leaf(&db, &set_json).await.unwrap();
    // climb::create_tree_nodes(&db, &subset_json).await.unwrap();
}
