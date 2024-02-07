use crate::database2::Database2;
use crate::DbInterfaceError;
use prfs_entities::entities::{PrfsIdSession, PrfsProofType};
use prfs_entities::sqlx::{self, Pool, Postgres, Row, Transaction};

pub async fn get_prfs_id_session(
    pool: &Pool<Postgres>,
    key: &String,
) -> Result<Option<PrfsIdSession>, DbInterfaceError> {
    let query = r#"
SELECT * FROM prfs_id_sessions
WHERE key=$1
"#;

    let row_result = sqlx::query(query).bind(&key).fetch_optional(pool).await;

    match row_result {
        Ok(row) => {
            if let Some(r) = row {
                let ret = PrfsIdSession {
                    key: r.get("key"),
                    value: r.get("value"),
                    ticket: r.get("ticket"),
                };
                return Ok(Some(ret));
            } else {
                return Err(format!("Prfs id session does not exist, key: {}", key).into());
            }
        }
        Err(err) => {
            return Err(err.into());
        }
    }
}

pub async fn upsert_prfs_id_session(
    tx: &mut Transaction<'_, Postgres>,
    session: &PrfsIdSession,
) -> Result<String, DbInterfaceError> {
    let query = r#"
INSERT INTO prfs_id_sessions 
(key, value, ticket)
VALUES ($1, $2, $3) 
ON CONFLICT (key) DO UPDATE SET (
value, ticket, updated_at
) = (
excluded.value, excluded.ticket, now()
)
RETURNING key
"#;

    let row = sqlx::query(query)
        .bind(&session.key)
        .bind(&session.value)
        .bind(&session.ticket)
        .fetch_one(&mut **tx)
        .await
        .unwrap();

    let key: String = row.get("key");

    Ok(key)
}

pub async fn delete_prfs_session(
    tx: &mut Transaction<'_, Postgres>,
    key: String,
    sig: String,
    // session: PrfsSession,
) -> String {
    let query = "INSERT INTO prfs_proof_instances \
            (proof_instance_id, proof_type_id, proof, public_inputs, short_id, prfs_ack_sig)
            VALUES ($1, $2, $3, $4, $5, $6) returning proof_instance_id";

    // let row = sqlx::query(query)
    //     .bind(&session.proof_instance_id)
    //     .bind(&session.proof_type_id)
    //     .bind(&session.proof)
    //     .fetch_one(&mut **tx)
    //     .await
    //     .unwrap();

    // let proof_instance_id: uuid::Uuid = row.get("proof_instance_id");

    // println!("proof_instance_id: {}", proof_instance_id);

    query.to_string()
}
