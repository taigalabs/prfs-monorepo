use prfs_db_driver::sqlx::{self, Pool, Postgres, QueryBuilder, Row, Transaction};
use prfs_entities::id_session::PrfsIdSession;

use crate::DbInterfaceError;

pub async fn get_prfs_id_session(
    pool: &Pool<Postgres>,
    key: &String,
) -> Result<Option<PrfsIdSession>, DbInterfaceError> {
    let query = r#"
SELECT * FROM prfs_id_sessions
WHERE key=$1
"#;

    let row_result = sqlx::query(query).bind(&key).fetch_optional(pool).await;

    match row_result {
        Ok(row) => {
            if let Some(r) = row {
                let ret = PrfsIdSession {
                    key: r.get("key"),
                    value: r.get("value"),
                    ticket: r.get("ticket"),
                };
                return Ok(Some(ret));
            } else {
                return Err(format!("Prfs id session does not exist, key: {}", key).into());
            }
        }
        Err(err) => {
            return Err(err.into());
        }
    }
}

pub async fn upsert_prfs_id_session(
    tx: &mut Transaction<'_, Postgres>,
    session: &PrfsIdSession,
) -> Result<String, DbInterfaceError> {
    let query = r#"
INSERT INTO prfs_id_sessions 
(key, value, ticket)
VALUES ($1, $2, $3) 
ON CONFLICT (key) DO UPDATE SET (
value, ticket, updated_at
) = (
excluded.value, excluded.ticket, now()
)
RETURNING key
"#;

    let row = sqlx::query(query)
        .bind(&session.key)
        .bind(&session.value)
        .bind(&session.ticket)
        .fetch_one(&mut **tx)
        .await
        .unwrap();

    let key: String = row.get("key");

    Ok(key)
}

pub async fn delete_prfs_session(
    tx: &mut Transaction<'_, Postgres>,
    key: &String,
    _ticket: &String,
) -> Result<(), DbInterfaceError> {
    let query = r#"
DELETE FROM prfs_id_sessions 
WHERE key=$1
RETURNING key
"#;

    let _row = sqlx::query(query)
        .bind(&key)
        .fetch_optional(&mut **tx)
        .await?;

    return Ok(());
}

pub async fn delete_prfs_session_without_ticket(
    tx: &mut Transaction<'_, Postgres>,
    key: &String,
) -> Result<(), DbInterfaceError> {
    let query = r#"
DELETE FROM prfs_id_sessions
WHERE key=$1
RETURNING key
"#;

    let _row = sqlx::query(query)
        .bind(&key)
        .fetch_optional(&mut **tx)
        .await?;

    return Ok(());
}
