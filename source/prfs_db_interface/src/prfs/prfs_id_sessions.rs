use crate::database2::Database2;
use crate::DbInterfaceError;
use prfs_entities::entities::{PrfsProofType, PrfsSession};
use prfs_entities::sqlx::{self, Pool, Postgres, Row, Transaction};
use rust_decimal::Decimal;

pub async fn get_prfs_id_session(pool: &Pool<Postgres>, key: &String) -> PrfsIdSession {
    let query = r#"
SELECT * FROM prfs_id_session 
WHERE key=$1
"#;

    let row = sqlx::query(query).bind(&key).fetch_one(pool).await.unwrap();

    let ret = PrfsIdSession {
        key: row.get("key"),
        value: row.get("value"),
        ticket: row.get("ticket"),
    };

    return ret;
}

pub async fn upsert_prfs_id_session(
    tx: &mut Transaction<'_, Postgres>,
    session: &PrfsSession,
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
