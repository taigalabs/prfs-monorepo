use prfs_db_driver::sqlx::{self, Pool, Postgres, Row, Transaction};
use shy_entities::{ShyChannel, ShyChannelMember};

use crate::ShyDbInterfaceError;

// pub async fn get_shy_channels(
//     pool: &Pool<Postgres>,
//     offset: i32,
//     limit: i32,
// ) -> Result<Vec<ShyChannel>, ShyDbInterfaceError> {
//     let query = r#"
// SELECT *
// FROM shy_channels
// WHERE status='Normal'
// ORDER BY updated_at DESC
// OFFSET $1
// LIMIT $2
// "#;

//     let rows = sqlx::query(&query)
//         .bind(offset)
//         .bind(limit)
//         .fetch_all(pool)
//         .await?;

//     let shy_channels: Vec<ShyChannel> = rows
//         .iter()
//         .map(|row| {
//             Ok(ShyChannel {
//                 channel_id: row.try_get("channel_id")?,
//                 label: row.try_get("label")?,
//                 locale: row.try_get("locale")?,
//                 desc: row.try_get("desc")?,
//                 proof_type_ids: row.try_get("proof_type_ids")?,
//                 status: row.try_get("status")?,
//                 r#type: row.try_get("type")?,
//             })
//         })
//         .collect::<Result<Vec<ShyChannel>, ShyDbInterfaceError>>()?;

//     Ok(shy_channels)
// }

pub async fn upsert_shy_channel_member(
    tx: &mut Transaction<'_, Postgres>,
    channel_member: &ShyChannelMember,
) -> Result<String, ShyDbInterfaceError> {
    let query = r#"
INSERT INTO shy_channel_members
(serial_no, channel_id, shy_proof_id, public_key)
VALUES ($1, $2, $3, $4)
ON CONFLICT (serial_no) DO UPDATE SET (
channel_id, shy_proof_id, public_key
) = (
excluded.channel_id, excluded.shy_proof_id, excluded.public_key
)
RETURNING serial_no
"#;

    let row = sqlx::query(query)
        .bind(&channel_member.serial_no)
        .bind(&channel_member.channel_id)
        .bind(&channel_member.shy_proof_id)
        .bind(&channel_member.public_key)
        .fetch_one(&mut **tx)
        .await?;

    let channel_id: String = row.try_get("serial_no")?;
    Ok(channel_id)
}
