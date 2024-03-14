use prfs_db_driver::sqlx::{self, Pool, Postgres, QueryBuilder, Row, Transaction};
use prfs_entities::entities::PrfsAccount;
use shy_entities::entities::ShyAccount;

use crate::ShyDbInterfaceError;

pub async fn get_shy_account_by_account_id(
    pool: &Pool<Postgres>,
    account_id: &String,
) -> Result<ShyAccount, ShyDbInterfaceError> {
    let query = "SELECT * from shy_accounts where account_id=$1";

    let row = sqlx::query(query).bind(&account_id).fetch_one(pool).await?;

    let acc = ShyAccount {
        account_id: row.get("account_id"),
        public_key: row.get("public_key"),
        avatar_color: row.get("avatar_color"),
    };

    Ok(acc)
}

pub async fn insert_shy_account(
    tx: &mut Transaction<'_, Postgres>,
    prfs_account: &ShyAccount,
) -> Result<String, ShyDbInterfaceError> {
    let query = r#"
INSERT INTO shy_accounts
(account_id, avatar_color, public_key)
VALUES ($1, $2, $3) returning account_id
"#;

    let row = sqlx::query(query)
        .bind(&prfs_account.account_id)
        .bind(&prfs_account.avatar_color)
        .bind(&prfs_account.public_key)
        .fetch_one(&mut **tx)
        .await?;

    let account_id: String = row.get("account_id");

    return Ok(account_id);
}
