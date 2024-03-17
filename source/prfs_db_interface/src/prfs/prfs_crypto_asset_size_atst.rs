use prfs_db_driver::sqlx::{self, Pool, Postgres, Row, Transaction};
use prfs_entities::atst_entities::PrfsCryptoAssetSizeAtst;

use crate::DbInterfaceError;

pub async fn insert_prfs_crypto_asset_size_atst(
    tx: &mut Transaction<'_, Postgres>,
    crypto_size_atst: &PrfsCryptoAssetSizeAtst,
) -> Result<String, DbInterfaceError> {
    let query = r#"
INSERT INTO prfs_crypto_asset_size_atsts
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
        .bind(&crypto_size_atst.atst_id)
        .bind(&crypto_size_atst.atst_type)
        .bind(&crypto_size_atst.label)
        .bind(&crypto_size_atst.cm)
        .bind(&crypto_size_atst.meta)
        .bind(&crypto_size_atst.value)
        .bind(&crypto_size_atst.status)
        .fetch_one(&mut **tx)
        .await?;

    let atst_id: String = row.get("atst_id");

    return Ok(atst_id);
}

pub async fn get_prfs_crypto_asset_size_atsts(
    pool: &Pool<Postgres>,
    offset: i32,
    limit: i32,
) -> Result<Vec<PrfsCryptoAssetSizeAtst>, DbInterfaceError> {
    let query = r#"
SELECT *
FROM prfs_crypto_asset_size_atsts
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
        .map(|row| PrfsCryptoAssetSizeAtst {
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
) -> Result<PrfsCryptoAssetSizeAtst, DbInterfaceError> {
    let query = r#"
SELECT *
FROM prfs_crypto_asset_size_atsts
WHERE atst_id=$1
"#;

    let row = sqlx::query(query).bind(&atst_id).fetch_one(pool).await?;

    let atst = PrfsCryptoAssetSizeAtst {
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
