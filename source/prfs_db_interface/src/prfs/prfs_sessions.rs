use crate::database2::Database2;
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

pub async fn insert_prfs_session(
    tx: &mut Transaction<'_, Postgres>,
    session: PrfsSession,
) -> String {
    let query = "INSERT INTO prfs_proof_instances \
            (proof_instance_id, proof_type_id, proof, public_inputs, short_id, prfs_ack_sig)
            VALUES ($1, $2, $3, $4, $5, $6) returning proof_instance_id";

    // let proof_instance = proof_instances.get(0).unwrap();

    // let row = sqlx::query(query)
    //     .bind(&proof_instance.proof_instance_id)
    //     .bind(&proof_instance.proof_type_id)
    //     .bind(&proof_instance.proof)
    //     .bind(&proof_instance.public_inputs)
    //     .bind(&proof_instance.short_id)
    //     .bind(&proof_instance.prfs_ack_sig)
    //     .fetch_one(&mut **tx)
    //     .await
    //     .unwrap();

    // let proof_instance_id: uuid::Uuid = row.get("proof_instance_id");

    // println!("proof_instance_id: {}", proof_instance_id);

    query.to_string()
}
