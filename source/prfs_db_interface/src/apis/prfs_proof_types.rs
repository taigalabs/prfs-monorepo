use crate::database2::Database2;
use prfs_entities::entities::PrfsProofType;
use prfs_entities::sqlx::{self, Pool, Postgres, Row, Transaction};
use rust_decimal::Decimal;
use uuid::Uuid;

pub async fn get_prfs_proof_type_by_proof_type_id(
    pool: &Pool<Postgres>,
    proof_type_id: &String,
) -> PrfsProofType {
    let query = "SELECT * from prfs_proof_types where proof_type_id=$1";

    let row = sqlx::query(query)
        .bind(&proof_type_id)
        .fetch_one(pool)
        .await
        .unwrap();

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

pub async fn get_prfs_proof_types(
    pool: &Pool<Postgres>,
    page_idx: i32,
    page_size: i32,
) -> Vec<PrfsProofType> {
    let offset = page_idx * page_size;

    let query = r#"
SELECT * FROM prfs_proof_types
ORDER BY updated_at
LIMIT $1
OFFSET $2
"#;

    let rows = sqlx::query(query)
        .bind(&page_size)
        .bind(&offset)
        .fetch_all(pool)
        .await
        .unwrap();

    let prfs_proof_types: Vec<PrfsProofType> = rows
        .iter()
        .map(|row| PrfsProofType {
            proof_type_id: row.get("proof_type_id"),
            label: row.get("label"),
            expression: row.get("expression"),
            img_url: row.get("img_url"),
            img_caption: row.get("img_caption"),
            author: row.get("author"),
            desc: row.get("desc"),
            circuit_id: row.get("circuit_id"),
            circuit_type_id: row.get("circuit_type_id"),
            circuit_inputs: row.get("circuit_inputs"),
            circuit_driver_id: row.get("circuit_driver_id"),
            driver_properties: row.get("driver_properties"),
            created_at: row.get("created_at"),
        })
        .collect();

    return prfs_proof_types;
}

pub async fn insert_prfs_proof_type(
    tx: &mut Transaction<'_, Postgres>,
    proof_type: &PrfsProofType,
) -> i64 {
    let query = "INSERT INTO prfs_proof_types \
(proof_type_id, author, label, \"desc\", circuit_id, circuit_inputs,\
circuit_driver_id, driver_properties, expression, img_url, img_caption, circuit_type_id) \
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) returning id";

    let row = sqlx::query(query)
        .bind(&proof_type.proof_type_id)
        .bind(&proof_type.author)
        .bind(&proof_type.label)
        .bind(&proof_type.desc)
        .bind(&proof_type.circuit_id)
        .bind(&proof_type.circuit_inputs)
        .bind(&proof_type.circuit_driver_id)
        .bind(&proof_type.driver_properties)
        .bind(&proof_type.expression)
        .bind(&proof_type.img_url)
        .bind(&proof_type.img_caption)
        .bind(&proof_type.circuit_type_id)
        .fetch_one(&mut **tx)
        .await
        .unwrap();

    let id: i64 = row.get("id");

    println!("id: {}", id);

    return id;
}
