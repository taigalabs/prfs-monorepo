use prfs_db_driver::sqlx::{self, Pool, Postgres, QueryBuilder, Row, Transaction};
use prfs_entities::entities::PrfsCircuitInputType;

pub async fn insert_prfs_circuit_input_type(
    tx: &mut Transaction<'_, Postgres>,
    circuit_input_type: &PrfsCircuitInputType,
) -> String {
    let query = r#"
INSERT INTO prfs_circuit_input_types
(circuit_input_type, properties_meta)
VALUES ($1, $2) returning circuit_input_type"#;

    let row = sqlx::query(query)
        .bind(&circuit_input_type.circuit_input_type)
        .bind(&circuit_input_type.properties_meta)
        .fetch_one(&mut **tx)
        .await
        .unwrap();

    let circuit_input_type: String = row.get("circuit_input_type");

    circuit_input_type
}
