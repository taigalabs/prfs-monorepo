use prfs_db_driver::sqlx::{self, Pool, Postgres, QueryBuilder, Row, Transaction};
use prfs_entities::entities::PrfsPolicyItem;

use crate::DbInterfaceError;

pub async fn get_policy_item_policy_id(
    pool: &Pool<Postgres>,
    policy_id: &String,
) -> Result<PrfsPolicyItem, DbInterfaceError> {
    let query = r#"
SELECT * from prfs_policy_item 
WHERE policy_id=$1
"#;

    let row = sqlx::query(query).bind(&policy_id).fetch_one(pool).await?;

    let prfs_policy_item = PrfsPolicyItem {
        policy_id: row.try_get("policy_id")?,
        description: row.try_get("description")?,
    };

    Ok(prfs_policy_item)
}

pub async fn insert_prfs_policy_item(
    tx: &mut Transaction<'_, Postgres>,
    prfs_policy_item: &PrfsPolicyItem,
) -> Result<String, DbInterfaceError> {
    let query = r#"
INSERT INTO prfs_policy_items
(policy_id, description)
VALUES ($1, $2)
RETURNING policy_id
"#;

    let row = sqlx::query(query)
        .bind(&prfs_policy_item.policy_id)
        .bind(&prfs_policy_item.description)
        .fetch_one(&mut **tx)
        .await?;

    let policy_id: String = row.try_get("policy_id")?;

    return Ok(policy_id);
}
