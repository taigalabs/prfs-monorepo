use prfs_db_driver::sqlx::{self, Pool, Postgres, Row, Transaction};
use shy_entities::ShyChannel;

use crate::ShyDbInterfaceError;

pub async fn get_shy_channels(
    pool: &Pool<Postgres>,
    offset: i32,
    limit: i32,
) -> Result<Vec<ShyChannel>, ShyDbInterfaceError> {
    let query = r#"
SELECT * 
FROM shy_channels
WHERE status='Normal'
ORDER BY updated_at DESC
OFFSET $1
LIMIT $2
"#;

    let rows = sqlx::query(&query)
        .bind(offset)
        .bind(limit)
        .fetch_all(pool)
        .await?;

    let shy_channels: Vec<ShyChannel> = rows
        .iter()
        .map(|row| {
            Ok(ShyChannel {
                channel_id: row.try_get("channel_id")?,
                label: row.try_get("label")?,
                locale: row.try_get("locale")?,
                desc: row.try_get("desc")?,
                proof_type_ids: row.try_get("proof_type_ids")?,
                status: row.try_get("status")?,
                assoc_proof_type_ids: row.try_get("assoc_proof_type_ids")?,
                r#type: row.try_get("type")?,
            })
        })
        .collect::<Result<Vec<ShyChannel>, ShyDbInterfaceError>>()?;

    Ok(shy_channels)
}

pub async fn get_shy_channel(
    pool: &Pool<Postgres>,
    channel_id: &String,
) -> Result<Option<ShyChannel>, ShyDbInterfaceError> {
    let query = r#"
SELECT *
FROM shy_channels
WHERE channel_id=$1
"#;

    let row = sqlx::query(&query)
        .bind(channel_id)
        .fetch_optional(pool)
        .await?;

    let shy_channel = if let Some(r) = row {
        let c = ShyChannel {
            channel_id: r.try_get("channel_id")?,
            label: r.try_get("label")?,
            locale: r.try_get("locale")?,
            desc: r.try_get("desc")?,
            assoc_proof_type_ids: r.try_get("assoc_proof_type_ids")?,
            proof_type_ids: r.try_get("proof_type_ids")?,
            status: r.try_get("status")?,
            r#type: r.try_get("type")?,
        };
        Some(c)
    } else {
        None
    };

    Ok(shy_channel)
}

pub async fn upsert_shy_channel(
    tx: &mut Transaction<'_, Postgres>,
    shy_channel: &ShyChannel,
) -> Result<String, ShyDbInterfaceError> {
    let query = r#"
INSERT INTO shy_channels
(channel_id, label, proof_type_ids, locale, "desc", status, type, assoc_proof_type_ids)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
ON CONFLICT (channel_id) DO UPDATE SET (
label, proof_type_ids, locale, "desc", status, updated_at, type, assoc_proof_type_ids
) = (
excluded.label, excluded.proof_type_ids, excluded.locale, excluded.desc, excluded.status, 
now(), excluded.type, excluded.assoc_proof_type_ids
)
RETURNING channel_id
"#;

    let row = sqlx::query(query)
        .bind(&shy_channel.channel_id)
        .bind(&shy_channel.label)
        .bind(&shy_channel.proof_type_ids)
        .bind(&shy_channel.locale)
        .bind(&shy_channel.desc)
        .bind(&shy_channel.status)
        .bind(&shy_channel.r#type)
        .bind(&shy_channel.assoc_proof_type_ids)
        .fetch_one(&mut **tx)
        .await?;

    let channel_id: String = row.try_get("channel_id")?;
    Ok(channel_id)
}
