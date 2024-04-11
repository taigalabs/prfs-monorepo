use prfs_db_driver::sqlx::{self, Pool, Postgres, Row, Transaction};
use shy_entities::entities::ShyProof;

use crate::ShyDbInterfaceError;

pub async fn insert_shy_proof(
    tx: &mut Transaction<'_, Postgres>,
    shy_proof: &ShyProof,
) -> Result<String, ShyDbInterfaceError> {
    let query = r#"
INSERT INTO shy_proofs
(shy_proof_id, proof, public_inputs, public_key, serial_no, proof_identity_input)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING shy_proof_id
"#;

    let row = sqlx::query(query)
        .bind(&shy_proof.shy_proof_id)
        .bind(&shy_proof.proof)
        .bind(&shy_proof.public_inputs)
        .bind(&shy_proof.public_key)
        .bind(&shy_proof.serial_no)
        .bind(&shy_proof.proof_identity_input)
        .fetch_one(&mut **tx)
        .await?;

    let proof_id: String = row.try_get("shy_proof_id")?;
    Ok(proof_id)
}

pub async fn get_shy_proof(
    pool: &Pool<Postgres>,
    public_key: &String,
) -> Result<ShyProof, ShyDbInterfaceError> {
    let query = r#"
SELECT *
FROM shy_proofs
WHERE public_key=$1
"#;

    let row = sqlx::query(&query).bind(public_key).fetch_one(pool).await?;

    let shy_proof = ShyProof {
        shy_proof_id: row.try_get("shy_proof_id")?,
        proof: row.try_get("proof")?,
        public_inputs: row.try_get("public_inputs")?,
        public_key: row.try_get("public_key")?,
        serial_no: row.try_get("serial_no")?,
        proof_identity_input: row.try_get("proof_identity_input")?,
    };

    Ok(shy_proof)
}
