use prfs_db_driver::sqlx::{self, Pool, Postgres, Row, Transaction};
use prfs_entities::atst_entities::PrfsAttestation;

use crate::DbInterfaceError;

pub async fn insert_prfs_attestation(
    tx: &mut Transaction<'_, Postgres>,
    prfs_attestation: &PrfsAttestation,
) -> Result<String, DbInterfaceError> {
    let query = r#"
INSERT INTO prfs_attestations
(atst_id, atst_type, label, cm, meta, value, status)
VALUES ($1, $2, $3, $4, $5, $6, $7)
ON CONFLICT (atst_id) DO UPDATE SET (
atst_type, label, cm, meta, updated_at, value, status
) = (
excluded.atst_type, excluded.label, excluded.cm, excluded.meta,
now(), excluded.value, excluded.status
)
RETURNING atst_id"#;

    let row = sqlx::query(query)
        .bind(&prfs_attestation.atst_id)
        .bind(&prfs_attestation.atst_type)
        .bind(&prfs_attestation.label)
        .bind(&prfs_attestation.cm)
        .bind(&prfs_attestation.meta)
        .bind(&prfs_attestation.value)
        .bind(&prfs_attestation.status)
        .fetch_one(&mut **tx)
        .await?;

    let atst_id: String = row.get("atst_id");

    return Ok(atst_id);
}

pub async fn get_prfs_crypto_asset_size_atsts(
    pool: &Pool<Postgres>,
    offset: i32,
    limit: i32,
) -> Result<Vec<PrfsAttestation>, DbInterfaceError> {
    let query = r#"
SELECT *
FROM prfs_attestations
LIMIT $1
OFFSET $2
"#;

    let rows = sqlx::query(query)
        .bind(limit)
        .bind(offset)
        .fetch_all(pool)
        .await?;

    let atsts = rows
        .iter()
        .map(|row| PrfsAttestation {
            atst_id: row.get("atst_id"),
            atst_type: row.get("atst_type"),
            cm: row.get("cm"),
            label: row.get("label"),
            value: row.get("value"),
            meta: row.get("meta"),
            status: row.get("status"),
        })
        .collect();

    Ok(atsts)
}

pub async fn get_prfs_crypto_asset_size_atst(
    pool: &Pool<Postgres>,
    atst_id: &String,
) -> Result<PrfsAttestation, DbInterfaceError> {
    let query = r#"
SELECT *
FROM prfs_attestations
WHERE atst_id=$1
"#;

    let row = sqlx::query(query).bind(&atst_id).fetch_one(pool).await?;

    let atst = PrfsAttestation {
        atst_id: row.get("atst_id"),
        atst_type: row.get("atst_type"),
        cm: row.get("cm"),
        label: row.get("label"),
        value: row.get("value"),
        meta: row.get("meta"),
        status: row.get("status"),
    };

    Ok(atst)
}
