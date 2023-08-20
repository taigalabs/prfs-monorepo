use crate::{database2::Database2, DbInterfaceError};
pub use prfs_entities::entities::PrfsAccount;
use sqlx::{Pool, Postgres, Row, Transaction};

pub async fn get_prfs_accounts(
    pool: &Pool<Postgres>,
    sig: &String,
) -> Result<Vec<PrfsAccount>, DbInterfaceError> {
    let query = "SELECT * from prfs_accounts where sig=$1";

    let rows = sqlx::query(query).bind(&sig).fetch_all(pool).await.unwrap();

    let prfs_accounts: Vec<PrfsAccount> = rows
        .iter()
        .map(|row| {
            let prfs_account = PrfsAccount {
                sig: row.get("sig"),
                avatar_color: row.get("avatar_color"),
            };

            prfs_account
        })
        .collect();

    Ok(prfs_accounts)
}

pub async fn insert_prfs_account(
    tx: &mut Transaction<'_, Postgres>,
    prfs_account: &PrfsAccount,
) -> Result<String, DbInterfaceError> {
    let query = "INSERT INTO prfs_accounts \
            (sig, avatar_color) \
            VALUES ($1) returning sig";

    let row = sqlx::query(query)
        .bind(&prfs_account.sig)
        .bind(&prfs_account.avatar_color)
        .fetch_one(&mut **tx)
        .await
        .unwrap();

    let sig: String = row.get("sig");

    return Ok(sig);
}
