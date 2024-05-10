use prfs_db_driver::sqlx::{self, Pool, Postgres, Row, Transaction};
use shy_entities::{ShyProof, ShyProofSyn1};

use crate::ShyDbInterfaceError;

pub async fn insert_shy_proof(
    tx: &mut Transaction<'_, Postgres>,
    shy_proof: &ShyProof,
) -> Result<String, ShyDbInterfaceError> {
    let query = r#"
INSERT INTO shy_proofs
(shy_proof_id, proof, public_inputs, public_key, serial_no, proof_identity_input, proof_type_id,
proof_idx)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING shy_proof_id
"#;

    let row = sqlx::query(query)
        .bind(&shy_proof.shy_proof_id)
        .bind(&shy_proof.proof)
        .bind(&shy_proof.public_inputs)
        .bind(&shy_proof.public_key)
        .bind(&shy_proof.serial_no)
        .bind(&shy_proof.proof_identity_input)
        .bind(&shy_proof.proof_type_id)
        .bind(&shy_proof.proof_idx)
        .fetch_one(&mut **tx)
        .await?;

    let proof_id: String = row.try_get("shy_proof_id")?;
    Ok(proof_id)
}

pub async fn get_shy_proofs(
    pool: &Pool<Postgres>,
    public_key: &String,
) -> Result<Vec<ShyProof>, ShyDbInterfaceError> {
    let query = r#"
SELECT *
FROM shy_proofs
WHERE public_key=$1
ORDER BY proof_idx ASC
"#;

    let rows = sqlx::query(&query).bind(public_key).fetch_all(pool).await?;

    let proofs = rows
        .iter()
        .map(|row| {
            let proof = ShyProof {
                shy_proof_id: row.try_get("shy_proof_id")?,
                proof: row.try_get("proof")?,
                public_inputs: row.try_get("public_inputs")?,
                public_key: row.try_get("public_key")?,
                serial_no: row.try_get("serial_no")?,
                proof_identity_input: row.try_get("proof_identity_input")?,
                proof_type_id: row.try_get("proof_type_id")?,
                proof_idx: row.try_get("proof_idx")?,
            };

            return Ok(proof);
        })
        .collect::<Result<Vec<ShyProof>, ShyDbInterfaceError>>()?;

    Ok(proofs)
}

pub async fn get_shy_proofs_by_proof_ids(
    pool: &Pool<Postgres>,
    proof_ids: &Vec<String>,
) -> Result<Vec<ShyProofSyn1>, ShyDbInterfaceError> {
    let query = r#"
SELECT p.*, pt.*
FROM shy_proofs p
INNER JOIN shy_proofs f ON f.shy_proof_id = ANY ($1)
INNER JOIN prfs_proof_types pt ON pt.proof_type_id = f.proof_type_id
ORDER BY proof_idx ASC
"#;

    let rows = sqlx::query(&query).bind(proof_ids).fetch_all(pool).await?;

    let proofs = rows
        .iter()
        .map(|row| {
            let proof = ShyProofSyn1 {
                shy_proof_id: row.try_get("shy_proof_id")?,
                proof: row.try_get("proof")?,
                public_inputs: row.try_get("public_inputs")?,
                public_key: row.try_get("public_key")?,
                serial_no: row.try_get("serial_no")?,
                proof_identity_input: row.try_get("proof_identity_input")?,
                proof_type_id: row.try_get("proof_type_id")?,
                proof_idx: row.try_get("proof_idx")?,
                img_url: row.try_get("img_url")?,
                expression: row.try_get("expression")?,
            };

            return Ok(proof);
        })
        .collect::<Result<Vec<ShyProofSyn1>, ShyDbInterfaceError>>()?;

    Ok(proofs)
}
