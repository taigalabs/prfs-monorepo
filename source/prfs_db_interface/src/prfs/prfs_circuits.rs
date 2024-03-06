use prfs_db_driver::sqlx::{self, Pool, Postgres, Row, Transaction};
use prfs_entities::entities::PrfsCircuit;
use prfs_entities::prfs_api::PrfsCircuitSyn1;
use uuid::Uuid;

pub async fn get_prfs_circuit_syn1_by_circuit_id(
    pool: &Pool<Postgres>,
    circuit_id: &String,
) -> PrfsCircuitSyn1 {
    let query = r#"
SELECT pc.*, pct.circuit_inputs_meta 
FROM prfs_circuits pc 
INNER JOIN prfs_circuit_types pct 
ON pc.circuit_type_id=pct.circuit_type_id
WHERE pc.circuit_id=$1"#;

    // println!("query: {}", query);

    let row = sqlx::query(query)
        .bind(&circuit_id)
        .fetch_one(pool)
        .await
        .unwrap();

    let circuit_syn1 = PrfsCircuitSyn1 {
        circuit_id: row.get("circuit_id"),
        circuit_type_id: row.get("circuit_type_id"),
        label: row.get("label"),
        desc: row.get("desc"),
        author: row.get("author"),
        num_public_inputs: row.get("num_public_inputs"),
        build_properties: row.get("build_properties"),
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
SELECT pc.*, pct.circuit_inputs_meta 
FROM prfs_circuits pc 
INNER JOIN prfs_circuit_types pct 
ON pc.circuit_type_id=pct.circuit_type_id"#;

    // println!("query: {}", query);

    let rows = sqlx::query(query).fetch_all(pool).await.unwrap();

    let circuits_syn1 = rows
        .iter()
        .map(|row| PrfsCircuitSyn1 {
            circuit_id: row.get("circuit_id"),
            circuit_type_id: row.get("circuit_type_id"),
            label: row.get("label"),
            desc: row.get("desc"),
            author: row.get("author"),
            num_public_inputs: row.get("num_public_inputs"),
            circuit_dsl: row.get("circuit_dsl"),
            arithmetization: row.get("arithmetization"),
            proof_algorithm: row.get("proof_algorithm"),
            build_properties: row.get("build_properties"),
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
(circuit_id, circuit_type_id, label, "desc", author, num_public_inputs, circuit_dsl, 
arithmetization, proof_algorithm, elliptic_curve, finite_field, circuit_driver_id, driver_version,
driver_properties, raw_circuit_inputs_meta, build_properties
)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
RETURNING circuit_id
"#;

    let row = sqlx::query(query)
        .bind(&circuit.circuit_id)
        .bind(&circuit.circuit_type_id)
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
        .bind(&circuit.build_properties)
        .fetch_one(&mut **tx)
        .await
        .unwrap();

    let circuit_id: Uuid = row.get("circuit_id");

    circuit_id
}
