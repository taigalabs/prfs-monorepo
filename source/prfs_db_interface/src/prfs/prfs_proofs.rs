use prfs_db_driver::sqlx::{self, Pool, Postgres, Row, Transaction};
use prfs_entities::{PrfsProof, PrfsProofSyn1};

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

pub async fn get_prfs_proof_by_proof_id(
    pool: &Pool<Postgres>,
    prfs_proof_id: &String,
) -> Result<PrfsProofSyn1, DbInterfaceError> {
    let query = r#"
SELECT p.*, t.img_url, t.expression, t.img_caption, t.label as proof_type_label
FROM prfs_proofs p
INNER JOIN prfs_proof_types t ON p.proof_type_id=t.proof_type_id
WHERE p.prfs_proof_id=$1
"#;

    let row = sqlx::query(query)
        .bind(prfs_proof_id)
        .fetch_one(pool)
        .await?;

    let proof = PrfsProofSyn1 {
        prfs_proof_id: row.try_get("prfs_proof_id")?,
        proof: row.try_get("proof")?,
        public_inputs: row.try_get("public_inputs")?,
        public_key: row.try_get("public_key")?,
        serial_no: row.try_get("serial_no")?,
        proof_identity_input: row.try_get("proof_identity_input")?,
        proof_type_id: row.try_get("proof_type_id")?,
        expression: row.try_get("expression")?,
        img_url: row.try_get("img_url")?,
        img_caption: row.try_get("img_caption")?,
        proof_type_label: row.try_get("proof_type_label")?,
    };

    Ok(proof)
}
