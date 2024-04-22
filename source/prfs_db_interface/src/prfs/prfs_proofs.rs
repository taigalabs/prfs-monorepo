use prfs_db_driver::sqlx::{self, Pool, Postgres, Row, Transaction};
use prfs_entities::PrfsProof;

use crate::DbInterfaceError;

pub async fn insert_prfs_proof(
    tx: &mut Transaction<'_, Postgres>,
    shy_proof: &PrfsProof,
) -> Result<String, DbInterfaceError> {
    let query = r#"
INSERT INTO prfs_proofs
(prfs_proof_id, proof, public_inputs, public_key, serial_no, proof_identity_input, proof_type_id)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING shy_proof_id
"#;

    let row = sqlx::query(query)
        .bind(&shy_proof.prfs_proof_id)
        .bind(&shy_proof.proof)
        .bind(&shy_proof.public_inputs)
        .bind(&shy_proof.public_key)
        .bind(&shy_proof.serial_no)
        .bind(&shy_proof.proof_identity_input)
        .bind(&shy_proof.proof_type_id)
        .fetch_one(&mut **tx)
        .await?;

    let proof_id: String = row.try_get("prfs_proof_id")?;
    Ok(proof_id)
}
