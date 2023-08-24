use prfs_entities::entities::{PrfsCircuit, PrfsCircuitDriver, PrfsCircuitType};
use prfs_entities::sqlx::{self, types::Json, Pool, Postgres, Row, Transaction};
use prfs_entities::{
    entities::{PrfsProofInstance, PrfsProofType},
    syn_entities::PrfsProofInstanceSyn1,
};
use rust_decimal::Decimal;
use uuid::Uuid;

pub async fn insert_prfs_circuit(
    tx: &mut Transaction<'_, Postgres>,
    circuit: &PrfsCircuit,
) -> Uuid {
    let query = r#"
INSERT INTO prfs_circuit
(circuit_id, circuit_type, label, "desc", author, num_public_inputs, circuit_dsl, arithmetization,
proof_algorithm, elliptic_curve, finite_field, circuit_driver_id, driver_version,
driver_properties, raw_circuit_inputs_meta
)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) returning circuit_id"#;

    let row = sqlx::query(query)
        .bind(&circuit.circuit_id)
        .bind(&circuit.circuit_type)
        .bind(&circuit.label)
        .bind(&circuit.desc)
        .bind(&circuit.author)
        .bind(&circuit.num_public_inputs)
        .bind(&circuit.circuit_dsl)
        .bind(&circuit.arithmetization)
        .bind(&circuit.proof_algorithm)
        .bind(&circuit.elliptic_curve)
        .bind(&circuit.finite_field)
        .bind(&circuit.circuit_driver_id)
        .bind(&circuit.driver_version)
        .bind(&circuit.driver_properties)
        .bind(&circuit.raw_circuit_inputs_meta)
        .fetch_one(&mut **tx)
        .await
        .unwrap();

    let circuit_id: Uuid = row.get("circuit_id");

    circuit_id
}
