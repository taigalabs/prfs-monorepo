use crate::envs::ENVS;
use clap::ArgMatches;
use prfs_db_interface::database::Database;

pub async fn revisit(_sub_matches: &ArgMatches) {
    let pg_endpoint = &ENVS.postgres_endpoint;
    let pg_pw = &ENVS.postgres_pw;
    let db = Database::connect(pg_endpoint, pg_pw).await.unwrap();

    run(&db).await;
}

async fn run(db: &Database) {
    let accs = db.get_eth_accounts("limit 5000").await.unwrap();
    println!("accs len: {}", accs.len());
}
