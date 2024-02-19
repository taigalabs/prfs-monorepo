use clap::ArgMatches;
use colored::Colorize;
use prfs_db_interface::database2::Database2;
use prfs_tree_maker::apis;
use prfs_tree_maker::envs::ENVS;

pub async fn run(_sub_matches: &ArgMatches) {
    let pg_endpoint = &ENVS.postgres_endpoint;
    let pg_username = &ENVS.postgres_username;
    let pg_pw = &ENVS.postgres_pw;

    let db2 = Database2::connect(pg_endpoint, pg_username, pg_pw)
        .await
        .unwrap();

    let pool = &db2.pool;
    let mut tx = pool.begin().await.unwrap();

    let set_json_path = &ENVS.set_json_path;
    let set_json = apis::require_set_json(set_json_path);

    let mut prfs_set = apis::create_set(&mut tx, &set_json).await.unwrap();

    // let prfs_tree_nodes =
    //     apis::create_leaves_without_offset(&pool, &mut tx, &set_json, &mut prfs_set)
    //         .await
    //         .unwrap();

    // let merkle_root = apis::create_tree_nodes(
    //     // &pool,
    //     &mut tx,
    //     &mut prfs_set,
    //     &prfs_tree_nodes,
    // )
    // .await
    // .unwrap();

    // tx.commit().await.unwrap();

    // println!(
    //     "{} a set with tree nodes, set_id: {}, cardinality: {}, merkle_root: {}",
    //     "Created".green(),
    //     prfs_set.set_id,
    //     prfs_tree_nodes.len(),
    //     merkle_root,
    // )
}
