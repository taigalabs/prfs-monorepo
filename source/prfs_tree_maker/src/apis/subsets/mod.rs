mod climb;
mod json;
mod leaf;

use clap::ArgMatches;
use prfs_db_interface::database::Database;

pub async fn create_subset(_sub_matches: &ArgMatches) {
    let pg_endpoint = std::env::var("POSTGRES_ENDPOINT").unwrap();
    let pg_pw = std::env::var("POSTGRES_PW").unwrap();
    let db = Database::connect(pg_endpoint, pg_pw).await.unwrap();

    let subset_json_filename = std::env::var("SUBSET_JSON_FILENAME").unwrap();
    let subset_json = json::require_subset_json(subset_json_filename);

    leaf::create_leaf(&db, &subset_json).await.unwrap();
    // climb::create_tree_nodes(&db, &subset_json).await.unwrap();
}
