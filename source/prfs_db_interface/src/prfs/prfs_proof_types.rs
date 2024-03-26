use prfs_db_driver::sqlx::{self, Pool, Postgres, QueryBuilder, Row, Transaction};
use prfs_entities::entities::PrfsProofType;

use crate::DbInterfaceError;

pub async fn get_prfs_proof_type_by_proof_type_id(
    pool: &Pool<Postgres>,
    proof_type_id: &String,
) -> Result<PrfsProofType, DbInterfaceError> {
    let query = "SELECT * from prfs_proof_types where proof_type_id=$1";

    let row = sqlx::query(query)
        .bind(&proof_type_id)
        .fetch_one(pool)
        .await?;

    let ret = PrfsProofType {
        proof_type_id: row.try_get("proof_type_id")?,
        expression: row.try_get("expression")?,
        img_url: row.try_get("img_url")?,
        img_caption: row.try_get("img_caption")?,
        label: row.try_get("label")?,
        author: row.try_get("author")?,
        desc: row.try_get("desc")?,
        circuit_id: row.try_get("circuit_id")?,
        circuit_type_id: row.try_get("circuit_type_id")?,
        circuit_type_data: row.try_get("circuit_type_data")?,
        circuit_driver_id: row.try_get("circuit_driver_id")?,
        created_at: row.try_get("created_at")?,
    };

    return Ok(ret);
}

pub async fn get_prfs_proof_types(
    pool: &Pool<Postgres>,
    offset: i32,
    limit: i32,
) -> Result<Vec<PrfsProofType>, DbInterfaceError> {
    let query = r#"
SELECT * FROM prfs_proof_types
ORDER BY updated_at
OFFSET $1
LIMIT $2
"#;

    let rows = sqlx::query(query)
        .bind(&offset)
        .bind(&limit)
        .fetch_all(pool)
        .await?;

    let prfs_proof_types = rows
        .iter()
        .map(|row| {
            Ok(PrfsProofType {
                proof_type_id: row.try_get("proof_type_id")?,
                label: row.try_get("label")?,
                expression: row.try_get("expression")?,
                img_url: row.try_get("img_url")?,
                img_caption: row.try_get("img_caption")?,
                author: row.try_get("author")?,
                desc: row.try_get("desc")?,
                circuit_id: row.try_get("circuit_id")?,
                circuit_type_id: row.try_get("circuit_type_id")?,
                circuit_type_data: row.try_get("circuit_type_data")?,
                circuit_driver_id: row.try_get("circuit_driver_id")?,
                created_at: row.try_get("created_at")?,
            })
        })
        .collect::<Result<Vec<PrfsProofType>, DbInterfaceError>>()?;

    return Ok(prfs_proof_types);
}

pub async fn insert_prfs_proof_type(
    tx: &mut Transaction<'_, Postgres>,
    proof_type: &PrfsProofType,
) -> Result<i64, DbInterfaceError> {
    let query = r#"
INSERT INTO prfs_proof_types
(proof_type_id, author, label, \"desc\", circuit_id,
circuit_driver_id, expression, img_url, img_caption, circuit_type_id, circuit_type_data)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
RETURNING id"#;

    let row = sqlx::query(query)
        .bind(&proof_type.proof_type_id)
        .bind(&proof_type.author)
        .bind(&proof_type.label)
        .bind(&proof_type.desc)
        .bind(&proof_type.circuit_id)
        .bind(&proof_type.circuit_driver_id)
        .bind(&proof_type.expression)
        .bind(&proof_type.img_url)
        .bind(&proof_type.img_caption)
        .bind(&proof_type.circuit_type_id)
        .bind(&proof_type.circuit_type_data)
        .fetch_one(&mut **tx)
        .await?;

    let id: i64 = row.try_get("id")?;

    return Ok(id);
}
