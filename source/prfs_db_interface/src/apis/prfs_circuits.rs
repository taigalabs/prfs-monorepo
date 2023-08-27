use prfs_entities::entities::{PrfsCircuit, PrfsCircuitDriver, PrfsCircuitType};
use prfs_entities::sqlx::{self, types::Json, Pool, Postgres, Row, Transaction};
use prfs_entities::syn_entities::PrfsCircuitSyn1;
use prfs_entities::{
    entities::{PrfsProofInstance, PrfsProofType},
    syn_entities::PrfsProofInstanceSyn1,
};
use rust_decimal::Decimal;
use uuid::Uuid;

pub async fn get_prfs_circuit_syn1_by_circuit_id(
    pool: &Pool<Postgres>,
    circuit_id: &Uuid,
) -> PrfsCircuitSyn1 {
    let query = r#"
select pc.*, pct.circuit_inputs_meta from prfs_circuits pc inner join prfs_circuit_types pct 
on pc.circuit_type=pct.circuit_type where pc.circuit_id=$1"#;

    println!("query: {}", query);

    let row = sqlx::query(query)
        .bind(&circuit_id)
        .fetch_one(pool)
        .await
        .unwrap();

    let circuit_syn1 = PrfsCircuitSyn1 {
        circuit_id: row.get("circuit_id"),
        circuit_type: row.get("circuit_type"),
        label: row.get("label"),
        desc: row.get("desc"),
        author: row.get("author"),
        num_public_inputs: row.get("num_public_inputs"),
        circuit_dsl: row.get("circuit_dsl"),
        arithmetization: row.get("arithmetization"),
        proof_algorithm: row.get("proof_algorithm"),
        elliptic_curve: row.get("elliptic_curve"),
        finite_field: row.get("finite_field"),
        circuit_driver_id: row.get("circuit_driver_id"),
        driver_version: row.get("driver_version"),
        driver_properties: row.get("driver_properties"),
        circuit_inputs_meta: row.get("circuit_inputs_meta"),
        raw_circuit_inputs_meta: row.get("raw_circuit_inputs_meta"),
        created_at: row.get("created_at"),
    };

    return circuit_syn1;
}

pub async fn get_prfs_circuits_syn1(
    pool: &Pool<Postgres>,
    page_idx: i32,
    page_size: i32,
) -> Vec<PrfsCircuitSyn1> {
    let query = r#"
select pc.*, pct.circuit_inputs_meta from prfs_circuits pc inner join prfs_circuit_types pct 
on pc.circuit_type=pct.circuit_type"#;

    println!("query: {}", query);

    let rows = sqlx::query(query).fetch_all(pool).await.unwrap();

    let circuits_syn1 = rows
        .iter()
        .map(|row| PrfsCircuitSyn1 {
            circuit_id: row.get("circuit_id"),
            circuit_type: row.get("circuit_type"),
            label: row.get("label"),
            desc: row.get("desc"),
            author: row.get("author"),
            num_public_inputs: row.get("num_public_inputs"),
            circuit_dsl: row.get("circuit_dsl"),
            arithmetization: row.get("arithmetization"),
            proof_algorithm: row.get("proof_algorithm"),
            elliptic_curve: row.get("elliptic_curve"),
            finite_field: row.get("finite_field"),
            circuit_driver_id: row.get("circuit_driver_id"),
            driver_version: row.get("driver_version"),
            driver_properties: row.get("driver_properties"),
            circuit_inputs_meta: row.get("circuit_inputs_meta"),
            raw_circuit_inputs_meta: row.get("raw_circuit_inputs_meta"),
            created_at: row.get("created_at"),
        })
        .collect();

    return circuits_syn1;
}

pub async fn insert_prfs_circuit(
    tx: &mut Transaction<'_, Postgres>,
    circuit: &PrfsCircuit,
) -> Uuid {
    let query = r#"
INSERT INTO prfs_circuits
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
