use crate::DbInterfaceError;
use prfs_entities::entities::{PrfsAccount, PrfsPolicyItem};
use prfs_entities::sqlx::{self, Pool, Postgres, Row, Transaction};

pub async fn get_policy_item_policy_id(
    pool: &Pool<Postgres>,
    policy_id: &String,
) -> Result<PrfsPolicyItem, DbInterfaceError> {
    let query = "SELECT * from prfs_policy_item where policy_id=$1";

    let row = sqlx::query(query)
        .bind(&policy_id)
        .fetch_one(pool)
        .await
        .unwrap();

    let prfs_policy_item = PrfsPolicyItem {
        policy_id: row.get("policy_id"),
        description: row.get("description"),
    };

    Ok(prfs_policy_item)
}

pub async fn insert_prfs_policy_item(
    tx: &mut Transaction<'_, Postgres>,
    prfs_policy_item: &PrfsPolicyItem,
) -> Result<String, DbInterfaceError> {
    let query = "INSERT INTO prfs_policy_items \
            (policy_id, description) \
            VALUES ($1, $2) returning policy_id";

    let row = sqlx::query(query)
        .bind(&prfs_policy_item.policy_id)
        .bind(&prfs_policy_item.description)
        .fetch_one(&mut **tx)
        .await
        .unwrap();

    let sig: String = row.get("policy_id");

    return Ok(sig);
}
