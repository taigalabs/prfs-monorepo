use prfs_db_driver::sqlx::{self, Pool, Postgres, QueryBuilder, Row, Transaction};
use prfs_entities::entities::PrfsCircuitType;

use crate::DbInterfaceError;

pub async fn get_prfs_circuit_types(
    pool: &Pool<Postgres>,
) -> Result<Vec<PrfsCircuitType>, DbInterfaceError> {
    let query = r#"
SELECT *
FROM prfs_circuit_types"#;

    let rows = sqlx::query(query).fetch_all(pool).await?;

    let circuit_types = rows
        .iter()
        .map(|row| {
            Ok(PrfsCircuitType {
                circuit_type_id: row.try_get("circuit_type_id")?,
                desc: row.try_get("desc")?,
                author: row.try_get("author")?,
                circuit_inputs_meta: row.try_get("circuit_inputs_meta")?,
                public_inputs_meta: row.try_get("public_inputs_meta")?,
                created_at: row.try_get("created_at")?,
            })
        })
        .collect();

    return circuit_types;
}

pub async fn get_prfs_circuit_type_by_circuit_type_id(
    pool: &Pool<Postgres>,
    circuit_type_id: &String,
) -> Result<PrfsCircuitType, DbInterfaceError> {
    let query = r#"
SELECT *
FROM prfs_circuit_types
WHERE circuit_type_id=$1"#;

    // println!("query: {}", query);

    let row = sqlx::query(query)
        .bind(&circuit_type_id)
        .fetch_one(pool)
        .await?;

    let circuit_types = PrfsCircuitType {
        circuit_type_id: row.try_get("circuit_type_id")?,
        desc: row.try_get("desc")?,
        author: row.try_get("author")?,
        circuit_inputs_meta: row.try_get("circuit_inputs_meta")?,
        public_inputs_meta: row.try_get("public_inputs_meta")?,
        created_at: row.try_get("created_at")?,
    };

    return Ok(circuit_types);
}

pub async fn insert_prfs_circuit_type(
    tx: &mut Transaction<'_, Postgres>,
    circuit_type: &PrfsCircuitType,
) -> Result<String, DbInterfaceError> {
    let query = r#"
INSERT INTO prfs_circuit_types
(circuit_type_id, "desc", author, circuit_inputs_meta, public_inputs_meta)
VALUES ($1, $2, $3, $4, $5)
RETURNING circuit_type_id"#;

    let row = sqlx::query(query)
        .bind(&circuit_type.circuit_type_id)
        .bind(&circuit_type.desc)
        .bind(&circuit_type.author)
        .bind(&circuit_type.circuit_inputs_meta)
        .bind(&circuit_type.public_inputs_meta)
        .fetch_one(&mut **tx)
        .await?;

    let circuit_type_id: String = row.try_get("circuit_type_id")?;

    Ok(circuit_type_id)
}
