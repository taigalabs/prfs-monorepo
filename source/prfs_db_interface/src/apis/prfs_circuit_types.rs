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
            circuit_type_id: row.get("circuit_type_id"),
            desc: row.get("desc"),
            author: row.get("author"),
            circuit_inputs_meta: row.get("circuit_inputs_meta"),
            public_inputs_meta: row.get("public_inputs_meta"),
            created_at: row.get("created_at"),
        })
        .collect();

    return circuit_types;
}

pub async fn get_prfs_circuit_type_by_label(
    pool: &Pool<Postgres>,
    label: &String,
) -> PrfsCircuitType {
    let query = r#"
select *
from prfs_circuit_types
where label=$1"#;

    println!("query: {}", query);

    let row = sqlx::query(query)
        .bind(&label)
        .fetch_one(pool)
        .await
        .unwrap();

    let circuit_types = PrfsCircuitType {
        circuit_type_id: row.get("circuit_type_id"),
        desc: row.get("desc"),
        author: row.get("author"),
        circuit_inputs_meta: row.get("circuit_inputs_meta"),
        public_inputs_meta: row.get("public_inputs_meta"),
        created_at: row.get("created_at"),
    };

    return circuit_types;
}

pub async fn insert_prfs_circuit_type(
    tx: &mut Transaction<'_, Postgres>,
    circuit_type: &PrfsCircuitType,
) -> String {
    let query = r#"
INSERT INTO prfs_circuit_types
(circuit_type_id, "desc", author, circuit_inputs_meta, public_inputs_meta)
VALUES ($1, $2, $3, $4, $5) returning label"#;

    let row = sqlx::query(query)
        .bind(&circuit_type.circuit_type_id)
        .bind(&circuit_type.desc)
        .bind(&circuit_type.author)
        .bind(&circuit_type.circuit_inputs_meta)
        .bind(&circuit_type.public_inputs_meta)
        .fetch_one(&mut **tx)
        .await
        .unwrap();

    let label: String = row.get("label");

    println!("label: {}", label);

    label
}
