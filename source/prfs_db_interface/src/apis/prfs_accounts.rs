use crate::DbInterfaceError;
use prfs_entities::entities::PrfsAccount;
use prfs_entities::sqlx::{self, Pool, Postgres, Row, Transaction};

pub async fn get_prfs_account_by_account_id(
    pool: &Pool<Postgres>,
    account_id: &String,
) -> Result<PrfsAccount, DbInterfaceError> {
    let query = "SELECT * from prfs_accounts where account_id=$1";

    let row = sqlx::query(query)
        .bind(&account_id)
        .fetch_one(pool)
        .await
        .unwrap();

    let prfs_account = PrfsAccount {
        account_id: row.get("account_id"),
        avatar_color: row.get("avatar_color"),
        policy_ids: row.get("policy_ids"),
    };

    Ok(prfs_account)
}

pub async fn insert_prfs_account(
    tx: &mut Transaction<'_, Postgres>,
    prfs_account: &PrfsAccount,
) -> Result<String, DbInterfaceError> {
    let query = "INSERT INTO prfs_accounts \
            (account_id, avatar_color, policy_ids) \
            VALUES ($1, $2, $3) returning account_id";

    let row = sqlx::query(query)
        .bind(&prfs_account.account_id)
        .bind(&prfs_account.avatar_color)
        .bind(&prfs_account.policy_ids)
        .fetch_one(&mut **tx)
        .await?;

    let account_id: String = row.get("account_id");

    return Ok(account_id);
}
