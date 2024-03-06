use prfs_entities::entities::PrfsProofRecord;
use prfs_entities::sqlx::{self, Pool, Postgres, Row, Transaction};

use crate::DbInterfaceError;

pub async fn get_prfs_proof_record(
    pool: &Pool<Postgres>,
    public_key: &String,
) -> Result<Option<PrfsProofRecord>, DbInterfaceError> {
    let query = r#"
SELECT *
FROM prfs_proof_records
WHERE public_key=$1
"#;

    let row = sqlx::query(query)
        .bind(&public_key)
        .fetch_optional(pool)
        .await?;

    if let Some(r) = row {
        let resp: PrfsProofRecord = PrfsProofRecord {
            public_key: r.get("public_key"),
            proof_starts_with: r.get("proof_starts_with"),
        };
        return Ok(Some(resp));
    } else {
        return Ok(None);
    }
}

pub async fn insert_prfs_proof_record(
    tx: &mut Transaction<'_, Postgres>,
    proof_record: &PrfsProofRecord,
) -> String {
    let query = r#"
INSERT INTO prfs_proof_records
(public_key, proof_starts_with)
VALUES ($1, $2)
RETURNING public_key
"#;

    let row = sqlx::query(query)
        .bind(&proof_record.public_key)
        .bind(&proof_record.proof_starts_with)
        .fetch_one(&mut **tx)
        .await
        .unwrap();

    let public_key: String = row.get("public_key");
    public_key
}
