use clap::ArgMatches;
use prfs_db_driver::database2::Database2;
use prfs_tree_maker::tree_maker_apis;
use prfs_tree_maker::{
    envs::ENVS,
    geth::{GetBalanceRequest, GethClient},
};

pub async fn run(_sub_matches: &ArgMatches) {
    let geth_endpoint: String = ENVS.geth_endpoint.to_string();
    let geth_client = GethClient::new(geth_endpoint);

    let pg_endpoint = &ENVS.postgres_endpoint;
    let pg_username = &ENVS.postgres_username;
    let pg_pw = &ENVS.postgres_pw;

    let db2 = Database2::connect(pg_endpoint, pg_username, pg_pw)
        .await
        .unwrap();

    let pool = &db2.pool;
    let mut tx = pool.begin().await.unwrap();

    tree_maker_apis::revisit(&pool, &mut tx, &geth_client).await;
}
