mod climb;
mod create;
mod json;
mod leaf;

use crate::envs::ENVS;
use clap::ArgMatches;
use prfs_db_interface::database::Database;

pub async fn create_set(_sub_matches: &ArgMatches) {
    let pg_endpoint = &ENVS.postgres_endpoint;
    let pg_pw = &ENVS.postgres_pw;
    let db = Database::connect(pg_endpoint, pg_pw).await.unwrap();

    let set_json_path = &ENVS.set_json_path;
    let set_json = json::require_set_json(set_json_path);

    let prfs_set = create::create_set(&db, &set_json).await.unwrap();
    leaf::create_leaves_without_offset(&db, &set_json, prfs_set)
        .await
        .unwrap();
    climb::create_tree_nodes(&db, &set_json).await.unwrap();
}
