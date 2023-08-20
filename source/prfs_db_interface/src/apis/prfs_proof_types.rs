use crate::database2::Database2;
use prfs_entities::entities::PrfsProofType;
use rust_decimal::Decimal;
use sqlx::{Pool, Postgres, Row, Transaction};

pub async fn get_prfs_proof_type(
    pool: &Pool<Postgres>,
    proof_type_id: &String,
) -> Vec<PrfsProofType> {
    let query = "SELECT * from prfs_proof_types where proof_type_id=$1";

    let rows = sqlx::query(query)
        .bind(&proof_type_id)
        .fetch_all(pool)
        .await
        .unwrap();

    let prfs_proof_types: Vec<PrfsProofType> = rows
        .iter()
        .map(|row| PrfsProofType {
            proof_type_id: row.get("proof_type_id"),
            label: row.get("label"),
            author: row.get("author"),
            desc: row.get("desc"),
            circuit_id: row.get("circuit_id"),
            circuit_inputs: row.get("circuit_inputs"),
            driver_id: row.get("driver_id"),
            driver_properties: row.get("driver_properties"),
            created_at: row.get("created_at"),
        })
        .collect();

    return prfs_proof_types;
}

pub async fn get_prfs_proof_types(pool: &Pool<Postgres>) -> Vec<PrfsProofType> {
    let query = "SELECT * from prfs_proof_types";

    let rows = sqlx::query(query).fetch_all(pool).await.unwrap();

    let prfs_proof_types: Vec<PrfsProofType> = rows
        .iter()
        .map(|row| PrfsProofType {
            proof_type_id: row.get("proof_type_id"),
            label: row.get("label"),
            author: row.get("author"),
            desc: row.get("desc"),
            circuit_id: row.get("circuit_id"),
            circuit_inputs: row.get("circuit_inputs"),
            driver_id: row.get("driver_id"),
            driver_properties: row.get("driver_properties"),
            created_at: row.get("created_at"),
        })
        .collect();

    return prfs_proof_types;
}

pub async fn insert_prfs_proof_types(
    tx: &mut Transaction<'_, Postgres>,
    proof_types: &Vec<PrfsProofType>,
) {
    let query = "INSERT INTO prfs_proof_types \
            (proof_type_id, author, label, \"desc\", circuit_id, circuit_inputs,\
            driver_id, driver_properties) \
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) returning id";

    let proof_type = proof_types.get(0).unwrap();

    let row = sqlx::query(query)
        .bind(&proof_type.proof_type_id)
        .bind(&proof_type.author)
        .bind(&proof_type.label)
        .bind(&proof_type.desc)
        .bind(&proof_type.circuit_id)
        .bind(&proof_type.circuit_inputs)
        .bind(&proof_type.driver_id)
        .bind(&proof_type.driver_properties)
        .fetch_one(&mut **tx)
        .await
        .unwrap();

    let id: Decimal = row.get("id");

    println!("id: {}", id);
}
