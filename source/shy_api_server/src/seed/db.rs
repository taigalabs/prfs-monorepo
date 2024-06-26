use prfs_db_driver::database2::Database2;
use prfs_tree_lib::envs::ENVS;

use crate::ShyServerError;

pub async fn connect_db() -> Database2 {
    let endpoint = ENVS.postgres_endpoint.to_string();
    let username = ENVS.postgres_username.to_string();
    let pw = ENVS.postgres_pw.to_string();

    let db2 = Database2::connect(&endpoint, &username, &pw).await.unwrap();

    db2
}
