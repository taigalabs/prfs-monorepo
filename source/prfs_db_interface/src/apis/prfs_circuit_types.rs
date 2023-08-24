use prfs_entities::entities::{PrfsCircuitDriver, PrfsCircuitType};
use prfs_entities::sqlx::{self, types::Json, Pool, Postgres, Row, Transaction};
use prfs_entities::{
    entities::{PrfsProofInstance, PrfsProofType},
    syn_entities::PrfsProofInstanceSyn1,
};
use rust_decimal::Decimal;

pub async fn get_prfs_circuit_types(pool: &Pool<Postgres>) -> Vec<PrfsCircuitType> {
    let query = r#"
select *
from prfs_circuit_types"#;

    println!("query: {}", query);

    let rows = sqlx::query(query).fetch_all(pool).await.unwrap();

    let circuit_types = rows
        .iter()
        .map(|row| PrfsCircuitType {
            circuit_type: row.get("circuit_type"),
            desc: row.get("desc"),
            author: row.get("author"),
            circuit_inputs_meta: row.get("circuit_inputs_meta"),
            prioritized_input_type_names: row.get("prioritized_input_type_names"),
            created_at: row.get("created_at"),
        })
        .collect();

    return circuit_types;
}

pub async fn get_prfs_circuit_types_by_circuit_type(
    pool: &Pool<Postgres>,
    circuit_type: &String,
) -> Vec<PrfsCircuitType> {
    let query = r#"
select *
from prfs_circuit_types
where circuit_type=$1"#;

    println!("query: {}", query);

    let rows = sqlx::query(query)
        .bind(&circuit_type)
        .fetch_all(pool)
        .await
        .unwrap();

    let circuit_types = rows
        .iter()
        .map(|row| PrfsCircuitType {
            circuit_type: row.get("circuit_type"),
            desc: row.get("desc"),
            author: row.get("author"),
            circuit_inputs_meta: row.get("circuit_inputs_meta"),
            prioritized_input_type_names: row.get("prioritized_input_type_names"),
            created_at: row.get("created_at"),
        })
        .collect();

    return circuit_types;
}

pub async fn insert_prfs_circuit_type(
    tx: &mut Transaction<'_, Postgres>,
    circuit_type: &PrfsCircuitType,
) -> String {
    let query = r#"
INSERT INTO prfs_circuit_types
(circuit_type, "desc", author, circuit_inputs_meta, prioritized_input_type_names)
VALUES ($1, $2, $3, $4, $5) returning circuit_type"#;

    let row = sqlx::query(query)
        .bind(&circuit_type.circuit_type)
        .bind(&circuit_type.desc)
        .bind(&circuit_type.author)
        .bind(&circuit_type.circuit_inputs_meta)
        .bind(&circuit_type.prioritized_input_type_names)
        .fetch_one(&mut **tx)
        .await
        .unwrap();

    let circuit_type: String = row.get("circuit_type");

    println!("circuit_type: {}", circuit_type);

    circuit_type
}
