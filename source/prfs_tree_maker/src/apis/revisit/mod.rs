use crate::envs::ENVS;
use clap::ArgMatches;
use prfs_db_interface::database::Database;

pub async fn revisit(_sub_matches: &ArgMatches) {
    let pg_endpoint = &ENVS.postgres_endpoint;
    let pg_pw = &ENVS.postgres_pw;
    let db = Database::connect(pg_endpoint, pg_pw).await.unwrap();
}
