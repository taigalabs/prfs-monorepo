use prfs_entities::sqlx::{self, Pool, Postgres, Row, Transaction};
use shy_entities::entities::{ShyPost, ShyPostProof};

use crate::ShyDbInterfaceError;

pub async fn insert_shy_post_proof(
    tx: &mut Transaction<'_, Postgres>,
    shy_post_proof: &ShyPostProof,
) -> Result<String, ShyDbInterfaceError> {
    let query = r#"
INSERT INTO shy_post_proofs
(shy_post_proof_id, proof, public_inputs, public_key, serial_no)
VALUES ($1, $2, $3, $4, $5)
RETURNING shy_post_proof_id
"#;

    let row = sqlx::query(query)
        .bind(&shy_post_proof.shy_post_proof_id)
        .bind(&shy_post_proof.proof)
        .bind(&shy_post_proof.public_inputs)
        .bind(&shy_post_proof.public_key)
        .bind(&shy_post_proof.serial_no)
        .fetch_one(&mut **tx)
        .await?;

    let proof_id: String = row.try_get("shy_post_proof_id")?;
    Ok(proof_id)
}
