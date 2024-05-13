use prfs_db_driver::sqlx::{self, Pool, Postgres, Row, Transaction};
use shy_entities::{DateTimed, ShyPost, ShyTopic};

use crate::ShyDbInterfaceError;

// pub async fn get_shy_topic_syn1s(
//     pool: &Pool<Postgres>,
//     channel_id: &String,
//     offset: i32,
//     limit: i32,
// ) -> Result<Vec<DateTimed<ShyTopic>>, ShyDbInterfaceError> {
//     let query = r#"
// SELECT t.*
// FROM shy_topics t
// WHERE t.channel_id=$1
// ORDER BY t.updated_at DESC
// OFFSET $2
// LIMIT $3
// "#;

//     let rows = sqlx::query(&query)
//         .bind(channel_id)
//         .bind(offset)
//         .bind(limit)
//         .fetch_all(pool)
//         .await?;

//     let shy_topics = rows
//         .iter()
//         .map(|row| {
//             let t = ShyTopic {
//                 title: row.try_get("title")?,
//                 topic_id: row.try_get("topic_id")?,
//                 content: row.try_get("content")?,
//                 author_proof_ids: row.try_get("author_proof_ids")?,
//                 author_public_key: row.try_get("author_public_key")?,
//                 channel_id: row.try_get("channel_id")?,
//                 total_reply_count: row.try_get("total_reply_count")?,
//                 // shy_proof_id: row.try_get("shy_proof_id")?,
//                 author_sig: row.try_get("author_sig")?,
//                 participant_proof_ids: row.try_get("participant_proof_ids")?,
//                 sub_channel_id: row.try_get("sub_channel_id")?,
//                 total_like_count: row.try_get("total_like_count")?,
//                 // other_proof_ids: row.try_get("other_proof_ids")?,
//             };
//             // img_url: row.try_get("img_url")?,
//             // expression: row.try_get("expression")?,
//             // public_inputs: row.try_get("public_inputs")?,
//             // proof: row.try_get("proof")?,
//             // proof_public_key: row.try_get("public_key")?,
//             // proof_type_id: row.try_get("proof_type_id")?,

//             let topic = DateTimed {
//                 inner: t,
//                 created_at: row.try_get("created_at")?,
//                 updated_at: row.try_get("updated_at")?,
//             };

//             return Ok(topic);
//         })
//         .collect::<Result<Vec<DateTimed<ShyTopic>>, ShyDbInterfaceError>>()?;

//     Ok(shy_topics)
// }
