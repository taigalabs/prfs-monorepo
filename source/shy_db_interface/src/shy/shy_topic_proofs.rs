use prfs_db_driver::sqlx::{self, Pool, Postgres, Row, Transaction};
use shy_entities::entities::ShyTopicProof;

use crate::ShyDbInterfaceError;

pub async fn insert_shy_topic_proof(
    tx: &mut Transaction<'_, Postgres>,
    shy_topic_proof: &ShyTopicProof,
) -> Result<String, ShyDbInterfaceError> {
    let query = r#"
INSERT INTO shy_topic_proofs
(shy_topic_proof_id, proof, public_inputs, public_key, serial_no, proof_identity_input)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING shy_topic_proof_id
"#;

    let row = sqlx::query(query)
        .bind(&shy_topic_proof.shy_topic_proof_id)
        .bind(&shy_topic_proof.proof)
        .bind(&shy_topic_proof.public_inputs)
        .bind(&shy_topic_proof.public_key)
        .bind(&shy_topic_proof.serial_no)
        .bind(&shy_topic_proof.proof_identity_input)
        .fetch_one(&mut **tx)
        .await?;

    let proof_id: String = row.try_get("shy_topic_proof_id")?;
    Ok(proof_id)
}

pub async fn get_shy_topic_proof(
    pool: &Pool<Postgres>,
    public_key: &String,
) -> Result<ShyTopicProof, ShyDbInterfaceError> {
    let query = r#"
SELECT *
FROM shy_topic_proofs
WHERE public_key=$1
"#;

    let row = sqlx::query(&query).bind(public_key).fetch_one(pool).await?;

    let topic_proof = ShyTopicProof {
        shy_topic_proof_id: row.try_get("shy_topic_proof_id")?,
        proof: row.try_get("proof")?,
        public_inputs: row.try_get("public_inputs")?,
        public_key: row.try_get("public_key")?,
        serial_no: row.try_get("serial_no")?,
        proof_identity_input: row.try_get("proof_identity_input")?,
    };

    Ok(topic_proof)
}
