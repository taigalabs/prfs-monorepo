use prfs_entities::entities::{PrfsProofInstance, PrfsProofRecord};
use prfs_entities::sqlx::{self, types::Json, Pool, Postgres, Row, Transaction};
use rust_decimal::Decimal;

use crate::DbInterfaceError;

pub async fn get_prfs_proof_record(
    pool: &Pool<Postgres>,
    public_key: &String,
) -> Result<PrfsProofRecord, DbInterfaceError> {
    let query = r#"
SELECT *
FROM prfs_proof_records
WHERE public_key=$1
"#;

    let row = sqlx::query(query).bind(&public_key).fetch_one(pool).await?;

    let resp: PrfsProofRecord = PrfsProofRecord {
        public_key: row.get("public_key"),
        serial_no: row.get("serial_no"),
        proof_starts_with: row.get("proof_starts_with"),
    };
    return Ok(resp);
}

pub async fn insert_prfs_proof_record(
    tx: &mut Transaction<'_, Postgres>,
    proof_record: &PrfsProofRecord,
) -> String {
    let query = r#"
INSERT INTO prfs_proof_records
(public_key, serial_no, proof_starts_with)
VALUES ($1, $2, $3) 
RETURNING public_key
"#;

    let row = sqlx::query(query)
        .bind(&proof_record.public_key)
        .bind(&proof_record.serial_no)
        .bind(&proof_record.proof_starts_with)
        .fetch_one(&mut **tx)
        .await
        .unwrap();

    let public_key: String = row.get("public_key");
    public_key
}
