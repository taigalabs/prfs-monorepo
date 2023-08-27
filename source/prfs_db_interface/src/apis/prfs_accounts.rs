use crate::{database2::Database2, DbInterfaceError};
use prfs_entities::entities::PrfsAccount;
use prfs_entities::sqlx::{self, Pool, Postgres, Row, Transaction};

pub async fn get_prfs_account_by_sig(
    pool: &Pool<Postgres>,
    sig: &String,
) -> Result<PrfsAccount, DbInterfaceError> {
    let query = "SELECT * from prfs_accounts where sig=$1";

    let row = sqlx::query(query).bind(&sig).fetch_one(pool).await.unwrap();

    let prfs_account = PrfsAccount {
        sig: row.get("sig"),
        avatar_color: row.get("avatar_color"),
    };

    Ok(prfs_account)
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
