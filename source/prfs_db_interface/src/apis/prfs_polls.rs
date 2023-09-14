use crate::DbInterfaceError;
use prfs_entities::apis_entities::CreatePrfsPollRequest;
use prfs_entities::entities::{PrfsAccount, PrfsPolicyItem, PrfsPoll};
use prfs_entities::sqlx::{self, Pool, Postgres, Row, Transaction};
use uuid::Uuid;

// pub async fn get_policy_item_policy_id(
//     pool: &Pool<Postgres>,
//     policy_id: &String,
// ) -> Result<PrfsPolicyItem, DbInterfaceError> {
//     let query = "SELECT * from prfs_policy_item where policy_id=$1";

//     let row = sqlx::query(query)
//         .bind(&policy_id)
//         .fetch_one(pool)
//         .await
//         .unwrap();

//     let prfs_policy_item = PrfsPolicyItem {
//         policy_id: row.get("policy_id"),
//         description: row.get("description"),
//     };

//     Ok(prfs_policy_item)
// }

pub async fn insert_prfs_poll(
    tx: &mut Transaction<'_, Postgres>,
    prfs_poll: &CreatePrfsPollRequest,
) -> Result<Uuid, DbInterfaceError> {
    let query = r#"
INSERT INTO prfs_polls
(poll_id, label, plural_voting, proof_type_id, author)
VALUES ($1, $2, $3, $4, $5) returning poll_id"#;

    let row = sqlx::query(query)
        .bind(&prfs_poll.poll_id)
        .bind(&prfs_poll.label)
        .bind(&prfs_poll.plural_voting)
        .bind(&prfs_poll.proof_type_id)
        .bind(&prfs_poll.author)
        .fetch_one(&mut **tx)
        .await
        .unwrap();

    let poll_id: Uuid = row.get("poll_id");

    return Ok(poll_id);
}
