mod data;

use prfs_db_interface::database2::Database2;

use crate::envs::ENVS;

use self::data::get_prfs_proof_types;

pub enum Endpoint {
    Local,
    Dev,
}

pub struct PostgresCredential {
    pub endpoint: String,
    pub username: String,
    pub pw: String,
}

pub async fn upload(endpoint: Endpoint) {
    let credential = match endpoint {
        Endpoint::Local => PostgresCredential {
            endpoint: "localhost:5455".to_string(),
            username: "postgres".to_string(),
            pw: "postgres".to_string(),
        },
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

    // let pool = &db2.pool;
    // let mut tx = pool.begin().await.unwrap();

    // let proof_types = get_prfs_proof_types();

    // println!("proof_types: {:?}", proof_types);
}
