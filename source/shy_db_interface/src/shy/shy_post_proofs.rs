use prfs_db_driver::sqlx::{self, Pool, Postgres, Row, Transaction};
use shy_entities::entities::ShyTopicProof;

use crate::ShyDbInterfaceError;

pub async fn insert_shy_topic_proof(
    tx: &mut Transaction<'_, Postgres>,
    shy_topic_proof: &ShyTopicProof,
) -> Result<String, ShyDbInterfaceError> {
    let query = r#"
INSERT INTO shy_topic_proofs
(shy_topic_proof_id, proof, public_inputs, public_key, serial_no)
VALUES ($1, $2, $3, $4, $5)
RETURNING shy_topic_proof_id
"#;

    let row = sqlx::query(query)
        .bind(&shy_topic_proof.shy_topic_proof_id)
        .bind(&shy_topic_proof.proof)
        .bind(&shy_topic_proof.public_inputs)
        .bind(&shy_topic_proof.public_key)
        .bind(&shy_topic_proof.serial_no)
        .fetch_one(&mut **tx)
        .await?;

    let proof_id: String = row.try_get("shy_topic_proof_id")?;
    Ok(proof_id)
}
