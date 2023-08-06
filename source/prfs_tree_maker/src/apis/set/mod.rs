mod climb;
mod create;
mod json;
mod leaf;

use crate::envs::ENVS;
use clap::ArgMatches;
use colored::Colorize;
use prfs_db_interface::database2::Database2;

pub async fn create_set(_sub_matches: &ArgMatches) {
    let pg_endpoint = &ENVS.postgres_endpoint;
    let pg_username = &ENVS.postgres_username;
    let pg_pw = &ENVS.postgres_pw;

    let db2 = Database2::connect(pg_endpoint, pg_username, pg_pw)
        .await
        .unwrap();

    let pool = &db2.pool;
    let mut tx = pool.begin().await.unwrap();

    let set_json_path = &ENVS.set_json_path;
    let set_json = json::require_set_json(set_json_path);

    let mut prfs_set = create::create_set(&mut tx, &set_json).await.unwrap();
    let cardinality = leaf::create_leaves_without_offset(&pool, &mut tx, &set_json, &mut prfs_set)
        .await
        .unwrap();
    let merkle_root = climb::create_tree_nodes(&pool, &mut tx, &set_json, &mut prfs_set)
        .await
        .unwrap();

    tx.commit().await.unwrap();

    println!(
        "{} a set with tree nodes, set_id: {}, cardinality: {}, merkle_root: {}",
        "Created".green(),
        prfs_set.set_id,
        cardinality,
        merkle_root,
    )
}
