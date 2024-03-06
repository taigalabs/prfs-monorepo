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
                public_key: row.try_get("public_key")?,
                shy_topic_proof_id: row.try_get("shy_topic_proof_id")?,
                content: row.try_get("content")?,
                channel_id: row.try_get("channel_id")?,
                proof_identity_input: row.try_get("proof_identity_input")?,
                num_replies: row.try_get("num_replies")?,
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
        content: row.try_get("content")?,
        channel_id: row.try_get("channel_id")?,
        shy_topic_proof_id: row.try_get("shy_topic_proof_id")?,
        proof_identity_input: row.try_get("proof_identity_input")?,
        num_replies: row.try_get("num_replies")?,
        public_key: row.try_get("public_key")?,
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
(topic_id, content, channel_id, shy_topic_proof_id, title, proof_identity_input, public_key)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING topic_id
"#;

    let row = sqlx::query(query)
        .bind(&shy_topic.topic_id)
        .bind(&shy_topic.content)
        .bind(&shy_topic.channel_id)
        .bind(&shy_topic.shy_topic_proof_id)
        .bind(&shy_topic.title)
        .bind(&shy_topic.proof_identity_input)
        .bind(&shy_topic.public_key)
        .fetch_one(&mut **tx)
        .await?;

    let topic_id: String = row.try_get("topic_id")?;
    Ok(topic_id)
}
