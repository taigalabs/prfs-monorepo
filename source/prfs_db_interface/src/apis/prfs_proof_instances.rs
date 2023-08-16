use crate::database2::Database2;
use prfs_entities::entities::{PrfsProofInstance, PrfsProofType};
use sqlx::{Pool, Postgres, Row, Transaction};

pub async fn get_prfs_proof_instance(
    pool: &Pool<Postgres>,
    proof_instance_id: &String,
) -> Vec<PrfsProofInstance> {
    let query = "SELECT * from prfs_proof_instances where proof_instance_id=$1";

    let rows = sqlx::query(query)
        .bind(&proof_instance_id)
        .fetch_all(pool)
        .await
        .unwrap();

    let prfs_proof_instances: Vec<PrfsProofInstance> = rows
        .iter()
        .map(|row| PrfsProofInstance {
            proof_instance_id: row.get("proof_instance_id"),
            proof_type_id: row.get("proof_type_id"),
            sig: row.get("sig"),
            proof: row.get("proof"),
            public_inputs: row.get("public_inputs"),
            created_at: row.get("created_at"),
        })
        .collect();

    return prfs_proof_instances;
}

pub async fn get_prfs_proof_instances(pool: &Pool<Postgres>) -> Vec<PrfsProofInstance> {
    let query = "SELECT * from prfs_proof_types";

    let rows = sqlx::query(query).fetch_all(pool).await.unwrap();

    let prfs_proof_instances: Vec<PrfsProofInstance> = rows
        .iter()
        .map(|row| PrfsProofInstance {
            proof_instance_id: row.get("proof_instance_id"),
            proof_type_id: row.get("proof_type_id"),
            sig: row.get("sig"),
            proof: row.get("proof"),
            public_inputs: row.get("public_inputs"),
            created_at: row.get("created_at"),
        })
        .collect();

    return prfs_proof_instances;
}

pub async fn insert_prfs_proof_instances(
    tx: &mut Transaction<'_, Postgres>,
    proof_instances: &Vec<PrfsProofInstance>,
) {
    let query = "INSERT INTO prfs_proof_instances \
            (proof_instance_id, proof_type_id, sig, proof, public_inputs)
            VALUES ($1, $2, $3, $4, $5) returning proof_type_id";

    let proof_instance = proof_instances.get(0).unwrap();

    let row = sqlx::query(query)
        .bind(&proof_instance.proof_instance_id)
        .bind(&proof_instance.proof_type_id)
        .bind(&proof_instance.sig)
        .bind(&proof_instance.proof)
        .bind(&proof_instance.public_inputs)
        .fetch_one(&mut **tx)
        .await
        .unwrap();

    let proof_instance_id: String = row.get("proof_instance_id");

    println!("proof_instance_id: {}", proof_instance_id);
}
