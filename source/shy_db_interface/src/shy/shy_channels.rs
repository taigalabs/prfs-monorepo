use prfs_db_driver::sqlx::{self, Pool, Postgres, Row, Transaction};
use shy_entities::entities::ShyChannel;

use crate::ShyDbInterfaceError;

pub async fn get_shy_channels(
    pool: &Pool<Postgres>,
    offset: i32,
    limit: i32,
) -> Result<Vec<ShyChannel>, ShyDbInterfaceError> {
    let query = r#"
SELECT * 
FROM shy_channels
ORDER BY updated_at DESC
OFFSET $1
LIMIT $2
"#;

    let rows = sqlx::query(&query)
        .bind(offset)
        .bind(limit)
        .fetch_all(pool)
        .await
        .unwrap();

    let shy_channels: Vec<ShyChannel> = rows
        .iter()
        .map(|row| ShyChannel {
            channel_id: row.get("channel_id"),
            label: row.get("label"),
            locale: row.get("locale"),
            desc: row.get("desc"),
            proof_type_ids: row.get("proof_type_ids"),
        })
        .collect();

    Ok(shy_channels)
}

pub async fn get_shy_channel(
    pool: &Pool<Postgres>,
    channel_id: &String,
) -> Result<ShyChannel, ShyDbInterfaceError> {
    let query = r#"
SELECT *
FROM shy_channels
WHERE channel_id=$1
"#;

    let row = sqlx::query(&query)
        .bind(channel_id)
        .fetch_one(pool)
        .await
        .expect("Row does not exist");

    let shy_channel = ShyChannel {
        channel_id: row.get("channel_id"),
        label: row.get("label"),
        locale: row.get("locale"),
        desc: row.get("desc"),
        proof_type_ids: row.get("proof_type_ids"),
    };

    Ok(shy_channel)
}

pub async fn insert_shy_channel(
    tx: &mut Transaction<'_, Postgres>,
    shy_channel: &ShyChannel,
) -> String {
    let query = r#"
INSERT INTO shy_channels
(channel_id, label, proof_type_ids, locale, "desc")
VALUES ($1, $2, $3, $4, $5)
RETURNING channel_id
"#;

    let row = sqlx::query(query)
        .bind(&shy_channel.channel_id)
        .bind(&shy_channel.label)
        .bind(&shy_channel.proof_type_ids)
        .bind(&shy_channel.locale)
        .bind(&shy_channel.desc)
        .fetch_one(&mut **tx)
        .await
        .unwrap();

    let channel_id: String = row.get("channel_id");

    channel_id
}
