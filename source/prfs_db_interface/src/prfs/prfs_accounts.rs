use prfs_db_driver::sqlx::{self, Pool, Postgres, QueryBuilder, Row, Transaction};
use prfs_entities::entities::PrfsAccount;

use crate::DbInterfaceError;

pub async fn get_prfs_account_by_account_id(
    pool: &Pool<Postgres>,
    account_id: &String,
) -> Result<PrfsAccount, DbInterfaceError> {
    let query = r#"
SELECT * 
FROM prfs_accounts 
WHERE account_id=$1
"#;

    let row = sqlx::query(query).bind(&account_id).fetch_one(pool).await?;

    let prfs_account = PrfsAccount {
        account_id: row.try_get("account_id")?,
        public_key: row.try_get("public_key")?,
        avatar_color: row.try_get("avatar_color")?,
        policy_ids: row.try_get("policy_ids")?,
    };

    Ok(prfs_account)
}

pub async fn insert_prfs_account(
    tx: &mut Transaction<'_, Postgres>,
    prfs_account: &PrfsAccount,
) -> Result<String, DbInterfaceError> {
    let query = r#"
INSERT INTO prfs_accounts
(account_id, avatar_color, policy_ids, public_key)
VALUES ($1, $2, $3, $4) returning account_id
"#;

    let row = sqlx::query(query)
        .bind(&prfs_account.account_id)
        .bind(&prfs_account.avatar_color)
        .bind(&prfs_account.policy_ids)
        .bind(&prfs_account.public_key)
        .fetch_one(&mut **tx)
        .await?;

    let account_id: String = row.try_get("account_id")?;

    return Ok(account_id);
}
