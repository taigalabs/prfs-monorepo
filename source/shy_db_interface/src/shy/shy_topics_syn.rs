use prfs_db_driver::sqlx::{self, Pool, Postgres, Row, Transaction};
use shy_entities::entities::{DateTimed, ShyTopic, ShyTopicPost};

use crate::ShyDbInterfaceError;

pub async fn get_shy_topic_posts(
    pool: &Pool<Postgres>,
    channel_id: &String,
    offset: i32,
    limit: i32,
) -> Result<Vec<DateTimed<ShyTopicPost>>, ShyDbInterfaceError> {
    let query = r#"
SELECT t.*, p.*, f.*
FROM shy_topics t 
INNER JOIN shy_posts p ON t.topic_id = p.post_id
INNER JOIN shy_topic_proofs f ON f.shy_topic_proof_id = p.shy_topic_proof_id
WHERE t.channel_id=$1
ORDER BY t.updated_at DESC
OFFSET $2
LIMIT $3
"#;

    let rows = sqlx::query(&query)
        .bind(channel_id)
        .bind(offset)
        .bind(limit)
        .fetch_all(pool)
        .await?;

    let shy_topics = rows
        .iter()
        .map(|row| {
            let topic_ = ShyTopicPost {
                title: row.try_get("title")?,
                topic_id: row.try_get("topic_id")?,
                author_public_key: row.try_get("author_public_key")?,
                channel_id: row.try_get("channel_id")?,
                num_replies: row.try_get("num_replies")?,
                shy_topic_proof_id: row.try_get("shy_topic_proof_id")?,
                proof_identity_input: row.try_get("proof_identity_input")?,
                author_sig: row.try_get("author_sig")?,
            };

            let topic = DateTimed {
                inner: topic_,
                created_at: row.try_get("created_at")?,
                updated_at: row.try_get("updated_at")?,
            };

            return Ok(topic);
        })
        .collect::<Result<Vec<DateTimed<ShyTopicPost>>, ShyDbInterfaceError>>()?;

    Ok(shy_topics)
}

pub async fn get_shy_posts_of_topic(
    pool: &Pool<Postgres>,
    topic_id: &String,
    offset: i32,
    limit: i32,
) -> Result<Vec<DateTimed<ShyTopicPost>>, ShyDbInterfaceError> {
    let query = r#"
SELECT t.*, p.*, f.*
FROM shy_topics t
INNER JOIN shy_posts p ON t.topic_id = p.post_id
INNER JOIN shy_topic_proofs f ON f.shy_topic_proof_id = p.shy_topic_proof_id
WHERE t.topic_id=$1
ORDER BY t.updated_at DESC
OFFSET $2
LIMIT $3
"#;

    let rows = sqlx::query(&query)
        .bind(topic_id)
        .bind(offset)
        .bind(limit)
        .fetch_all(pool)
        .await?;

    let shy_topics = rows
        .iter()
        .map(|row| {
            let topic_ = ShyTopicPost {
                title: row.try_get("title")?,
                topic_id: row.try_get("topic_id")?,
                author_public_key: row.try_get("author_public_key")?,
                channel_id: row.try_get("channel_id")?,
                num_replies: row.try_get("num_replies")?,
                shy_topic_proof_id: row.try_get("shy_topic_proof_id")?,
                proof_identity_input: row.try_get("proof_identity_input")?,
                author_sig: row.try_get("author_sig")?,
            };

            let topic = DateTimed {
                inner: topic_,
                created_at: row.try_get("created_at")?,
                updated_at: row.try_get("updated_at")?,
            };

            return Ok(topic);
        })
        .collect::<Result<Vec<DateTimed<ShyTopicPost>>, ShyDbInterfaceError>>()?;

    Ok(shy_topics)
}
