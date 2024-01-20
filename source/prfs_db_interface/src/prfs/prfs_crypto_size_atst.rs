use crate::DbInterfaceError;
use prfs_entities::entities::{PrfsAccAtst, PrfsCryptoSizeAtst, PrfsIdentity};
use prfs_entities::sqlx::{self, Pool, Postgres, Row, Transaction};

pub async fn insert_prfs_crypto_size_atst(
    tx: &mut Transaction<'_, Postgres>,
    crypto_size_atst: &PrfsCryptoSizeAtst,
) -> Result<String, DbInterfaceError> {
    let query = r#"
INSERT INTO prfs_crypto_size_atsts
(atst_id, atst_type, wallet_addr, cm, amount, unit, status)
VALUES ($1, $2, $3, $4, $5, $6, $7) 
ON CONFLICT (atst_id) DO UPDATE SET (
atst_type, wallet_addr, cm, amount, unit, updated_at, status
) = (
excluded.atst_type, excluded.wallet_addr, excluded.cm, excluded.amount, excluded.unit, 
now(), excluded.status
)
RETURNING atst_id"#;

    let row = sqlx::query(query)
        .bind(&crypto_size_atst.atst_id)
        .bind(&crypto_size_atst.atst_type)
        .bind(&crypto_size_atst.wallet_addr)
        .bind(&crypto_size_atst.cm)
        .bind(&crypto_size_atst.amount)
        .bind(&crypto_size_atst.unit)
        .bind(&crypto_size_atst.status)
        .fetch_one(&mut **tx)
        .await?;

    let atst_id: String = row.get("atst_id");

    return Ok(atst_id);
}
