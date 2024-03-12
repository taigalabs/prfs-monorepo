use prfs_db_driver::sqlx::{self, Pool, Postgres, Row, Transaction};
use shy_entities::entities::{DateTimed, ShyTopic};

use crate::ShyDbInterfaceError;

pub async fn get_shy_topics(
    pool: &Pool<Postgres>,
    channel_id: &String,
    offset: i32,
    limit: i32,
) -> Result<Vec<DateTimed<ShyTopic>>, ShyDbInterfaceError> {
    let query = r#"
SELECT * 
FROM shy_topics 
WHERE channel_id=$1
ORDER BY updated_at DESC
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
            let topic_ = ShyTopic {
                title: row.try_get("title")?,
                topic_id: row.try_get("topic_id")?,
                channel_id: row.try_get("channel_id")?,
                total_reply_count: row.try_get("total_reply_count")?,
                author_public_key: row.try_get("author_public_key")?,
                content: row.try_get("content")?,
                shy_topic_proof_id: row.try_get("shy_topic_proof_id")?,
                author_sig: row.try_get("author_sig")?,
                participant_identity_inputs: row.try_get("participant_identity_inputs")?,
                sub_channel_id: row.try_get("sub_channel_id")?,
                total_like_count: row.try_get("total_like_count")?,
            };

            let topic = DateTimed {
                inner: topic_,
                created_at: row.try_get("created_at")?,
                updated_at: row.try_get("updated_at")?,
            };

            return Ok(topic);
        })
        .collect::<Result<Vec<DateTimed<ShyTopic>>, ShyDbInterfaceError>>()?;

    Ok(shy_topics)
}

pub async fn get_shy_topic(
    pool: &Pool<Postgres>,
    topic_id: &String,
) -> Result<DateTimed<ShyTopic>, ShyDbInterfaceError> {
    let query = r#"
SELECT * 
FROM shy_topics
WHERE topic_id=$1
"#;

    let row = sqlx::query(&query).bind(topic_id).fetch_one(pool).await?;

    let topic = ShyTopic {
        title: row.try_get("title")?,
        topic_id: row.try_get("topic_id")?,
        channel_id: row.try_get("channel_id")?,
        total_reply_count: row.try_get("total_reply_count")?,
        author_public_key: row.try_get("author_public_key")?,
        content: row.try_get("content")?,
        shy_topic_proof_id: row.try_get("shy_topic_proof_id")?,
        author_sig: row.try_get("author_sig")?,
        participant_identity_inputs: row.try_get("participant_identity_inputs")?,
        sub_channel_id: row.try_get("sub_channel_id")?,
        total_like_count: row.try_get("total_like_count")?,
    };
    let topic = DateTimed {
        inner: topic,
        created_at: row.try_get("created_at")?,
        updated_at: row.try_get("updated_at")?,
    };

    Ok(topic)
}

pub async fn insert_shy_topic(
    tx: &mut Transaction<'_, Postgres>,
    shy_topic: &ShyTopic,
) -> Result<String, ShyDbInterfaceError> {
    let query = r#"
INSERT INTO shy_topics
(topic_id, channel_id, title, author_public_key, total_reply_count, content, shy_topic_proof_id, 
author_sig, participant_identity_inputs, sub_channel_id, total_like_count)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
RETURNING topic_id
"#;

    let row = sqlx::query(query)
        .bind(&shy_topic.topic_id)
        .bind(&shy_topic.channel_id)
        .bind(&shy_topic.title)
        .bind(&shy_topic.author_public_key)
        .bind(&shy_topic.total_reply_count)
        .bind(&shy_topic.content)
        .bind(&shy_topic.shy_topic_proof_id)
        .bind(&shy_topic.author_sig)
        .bind(&shy_topic.participant_identity_inputs)
        .bind(&shy_topic.sub_channel_id)
        .bind(&shy_topic.total_like_count)
        .fetch_one(&mut **tx)
        .await?;

    let topic_id: String = row
        .try_get("topic_id")
        .map_err(|err| format!("Insert shy topic failed, err: {}", err))?;

    Ok(topic_id)
}
