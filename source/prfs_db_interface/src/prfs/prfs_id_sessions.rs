use crate::database2::Database2;
use crate::DbInterfaceError;
use prfs_entities::entities::{PrfsProofType, PrfsSession};
use prfs_entities::sqlx::{self, Pool, Postgres, Row, Transaction};
use rust_decimal::Decimal;

pub async fn get_prfs_session(pool: &Pool<Postgres>, key: String) -> PrfsProofType {
    let query = "SELECT * from prfs_proof_types where proof_type_id=$1";

    let row = sqlx::query(query).bind(&key).fetch_one(pool).await.unwrap();

    let ret = PrfsProofType {
        proof_type_id: row.get("proof_type_id"),
        expression: row.get("expression"),
        img_url: row.get("img_url"),
        img_caption: row.get("img_caption"),
        label: row.get("label"),
        author: row.get("author"),
        desc: row.get("desc"),
        circuit_id: row.get("circuit_id"),
        circuit_type_id: row.get("circuit_type_id"),
        circuit_inputs: row.get("circuit_inputs"),
        circuit_driver_id: row.get("circuit_driver_id"),
        driver_properties: row.get("driver_properties"),
        created_at: row.get("created_at"),
    };

    return ret;
}

pub async fn upsert_prfs_session(
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
