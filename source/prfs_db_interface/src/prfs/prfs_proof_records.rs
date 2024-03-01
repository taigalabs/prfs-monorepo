use prfs_entities::entities::{PrfsProofInstance, PrfsProofRecord, PrfsProofType};
use prfs_entities::prfs_api::PrfsProofInstanceSyn1;
use prfs_entities::sqlx::{self, types::Json, Pool, Postgres, Row, Transaction};
use rust_decimal::Decimal;

// pub async fn get_prfs_proof_instances(
//     pool: &Pool<Postgres>,
//     limit: Option<u32>,
// ) -> Vec<PrfsProofInstance> {
//     let query = "SELECT * from prfs_proof_instances limit $1";

//     // println!("query: {}", query);

//     let limit = Decimal::from(20);

//     let rows = sqlx::query(query)
//         .bind(&limit)
//         .fetch_all(pool)
//         .await
//         .unwrap();

//     let prfs_proof_instances: Vec<PrfsProofInstance> = rows
//         .iter()
//         .map(|row| PrfsProofInstance {
//             proof_instance_id: row.get("proof_instance_id"),
//             proof_type_id: row.get("proof_type_id"),
//             prfs_ack_sig: row.get("prfs_ack_sig"),
//             short_id: row.get("short_id"),
//             proof: vec![],
//             public_inputs: row.get("public_inputs"),
//             created_at: row.get("created_at"),
//         })
//         .collect();

//     return prfs_proof_instances;
// }

pub async fn insert_prfs_proof_record(
    tx: &mut Transaction<'_, Postgres>,
    proof_record: &PrfsProofRecord,
) -> String {
    let query = r#"
INSERT INTO prfs_proof_records
(public_key, serial_no, proof_starts_with)
VALUES ($1, $2, $3) 
RETURNING public_key
"#;

    let row = sqlx::query(query)
        .bind(&proof_record.public_key)
        .bind(&proof_record.serial_no)
        .bind(&proof_record.proof_starts_with)
        .fetch_one(&mut **tx)
        .await
        .unwrap();

    let public_key: String = row.get("public_key");
    public_key
}
