use prfs_db_driver::sqlx::{self, Pool, Postgres, QueryBuilder, Row, Transaction};
use prfs_entities::id_entities::PrfsIdentity;

use crate::DbInterfaceError;

pub async fn get_prfs_identity_by_id(
    pool: &Pool<Postgres>,
    identity_id: &String,
) -> Result<PrfsIdentity, DbInterfaceError> {
    let query = "SELECT * from prfs_identities where identity_id=$1";

    let row = sqlx::query(query)
        .bind(&identity_id)
        .fetch_one(pool)
        .await?;

    let prfs_identity = PrfsIdentity {
        identity_id: row.get("identity_id"),
        avatar_color: row.get("avatar_color"),
        public_key: row.get("public_key"),
        identity_type: row.get("identity_type"),
    };

    Ok(prfs_identity)
}

pub async fn insert_prfs_identity(
    tx: &mut Transaction<'_, Postgres>,
    prfs_identity: &PrfsIdentity,
) -> Result<String, DbInterfaceError> {
    let query = r#"
INSERT INTO prfs_identities
(identity_id, avatar_color, public_key, identity_type)
VALUES ($1, $2, $3, $4) returning identity_id
"#;

    let row = sqlx::query(query)
        .bind(&prfs_identity.identity_id)
        .bind(&prfs_identity.avatar_color)
        .bind(&prfs_identity.public_key)
        .bind(&prfs_identity.identity_type)
        .fetch_one(&mut **tx)
        .await?;

    let identity_id: String = row.get("identity_id");

    return Ok(identity_id);
}
