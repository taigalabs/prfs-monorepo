use prfs_db_driver::sqlx::{self, Pool, Postgres, Row, Transaction};
use prfs_entities::PrfsProof;

use crate::DbInterfaceError;

pub async fn insert_prfs_proof(
    tx: &mut Transaction<'_, Postgres>,
    proof: &PrfsProof,
) -> Result<String, DbInterfaceError> {
    let query = r#"
INSERT INTO prfs_proofs
(prfs_proof_id, proof, public_inputs, public_key, serial_no, proof_identity_input, proof_type_id)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING prfs_proof_id
"#;

    let row = sqlx::query(query)
        .bind(&proof.prfs_proof_id)
        .bind(&proof.proof)
        .bind(&proof.public_inputs)
        .bind(&proof.public_key)
        .bind(&proof.serial_no)
        .bind(&proof.proof_identity_input)
        .bind(&proof.proof_type_id)
        .fetch_one(&mut **tx)
        .await?;

    let proof_id: String = row.try_get("prfs_proof_id")?;
    Ok(proof_id)
}
