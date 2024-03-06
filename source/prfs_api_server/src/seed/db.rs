use prfs_db_driver::database2::Database2;

use crate::envs::ENVS;

pub enum Endpoint {
    Local,
    Dev,
}

pub struct PostgresCredential {
    pub endpoint: String,
    pub username: String,
    pub pw: String,
}

pub async fn connect_db(endpoint: Endpoint) -> Database2 {
    let credential = match endpoint {
        Endpoint::Local => {
            let endpoint = "localhost:5455".to_string();
            let username = ENVS.postgres_username.to_string();
            let pw = ENVS.postgres_pw.to_string();

            PostgresCredential {
                endpoint,
                username,
                pw,
            }
        }
        Endpoint::Dev => {
            let endpoint = ENVS.postgres_endpoint.to_string();
            let username = ENVS.postgres_username.to_string();
            let pw = ENVS.postgres_pw.to_string();

            PostgresCredential {
                endpoint,
                username,
                pw,
            }
        }
    };

    let db2 = Database2::connect(&credential.endpoint, &credential.username, &credential.pw)
        .await
        .unwrap();

    db2
}
