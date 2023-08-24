use prfs_entities::entities::{PrfsCircuit, PrfsCircuitDriver, PrfsCircuitType};
use prfs_entities::sqlx::{self, types::Json, Pool, Postgres, Row, Transaction};
use prfs_entities::syn_entities::PrfsCircuitSyn1;
use prfs_entities::{
    entities::{PrfsProofInstance, PrfsProofType},
    syn_entities::PrfsProofInstanceSyn1,
};
use rust_decimal::Decimal;
use uuid::Uuid;

pub async fn get_prfs_circuit_syn1(pool: &Pool<Postgres>, circuit_id: &Uuid) -> PrfsCircuitSyn1 {
    let query = r#"
select pc.*, pct.circuit_inputs_meta from prfs_circuits pc inner join prfs_circuit_types pct 
on pc.circuit_type=pct.circuit_type where pc.circuit_id=$1"#;

    println!("query: {}", query);

    let row = sqlx::query(query)
        .bind(&circuit_id)
        .fetch_one(pool)
        .await
        .unwrap();

    let circuits_syn1 = PrfsCircuitSyn1 {
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
        raw_circuit_inputs_meta: row.get("raw_cicuit_inputs_meta"),
        created_at: row.get("created_at"),
    };

    return circuits_syn1;
}

pub async fn get_prfs_circuits_syn1(pool: &Pool<Postgres>) {}

// fn load_circuits(
//     circuit_types: &HashMap<String, CircuitType>,
//     circuit_input_types: &HashMap<String, CircuitInputType>,
// ) -> HashMap<String, PrfsCircuitSyn1> {
//     let build_list_json = prfs_circuit_circom::access::read_circuit_artifacts();
//     let build_path = prfs_circuit_circom::access::get_build_fs_path();

//     let mut syn_circuits = HashMap::new();
//     let mut circuit_ids = HashSet::new();

//     for circuit_name in build_list_json.circuits {
//         let circuit_build_json_path = build_path.join(format!("{}/{}", circuit_name, "build.json"));
//         println!(
//             "Reading circuit, name: {:?}",
//             circuit_build_json_path.file_name()
//         );

//         let b = std::fs::read(circuit_build_json_path).unwrap();
//         let build_json: CircuitBuildJson = serde_json::from_slice(&b).unwrap();

//         if circuit_ids.contains(&build_json.circuit.circuit_id.to_string()) {
//             panic!("Duplicate circuit id, build_json: {:?}", build_json);
//         }

//         let c = build_json.circuit;
//         let circuit_type = circuit_types.get(&c.circuit_type).unwrap();

//         let mut relevant_input_types = vec![];
//         for circuit_input in circuit_type.circuit_inputs_meta.iter() {
//             let circuit_input_type = circuit_input_types.get(&circuit_input.r#type).unwrap();
//             relevant_input_types.push(circuit_input_type.clone());
//         }

//         let syn_circuit = PrfsCircuitSyn1 {
//             circuit_id: c.circuit_id,
//             circuit_type: c.circuit_type,
//             label: c.label,
//             desc: c.desc,
//             author: c.author,
//             num_public_inputs: c.num_public_inputs,
//             circuit_dsl: c.circuit_dsl,
//             arithmetization: c.arithmetization,
//             proof_algorithm: c.proof_algorithm,
//             elliptic_curve: c.elliptic_curve,
//             finite_field: c.finite_field,
//             driver_id: c.driver_id,
//             driver_version: c.driver_version,
//             driver_properties: c.driver_properties,
//             circuit_inputs_meta: circuit_type.circuit_inputs_meta.clone(),
//             // circuit_input_types: relevant_input_types,
//             raw_circuit_inputs_meta: c.raw_circuit_inputs_meta,
//             created_at: c.created_at,
//         };

//         circuit_ids.insert(c.circuit_id.to_string());
//         syn_circuits.insert(circuit_name, syn_circuit);
//     }

//     syn_circuits
// }

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
