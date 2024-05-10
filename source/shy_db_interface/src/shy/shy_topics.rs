use prfs_db_driver::sqlx::{self, Pool, Postgres, Row, Transaction};
use shy_entities::{DateTimed, ShyTopic};

use crate::shy::queries::get_shy_topic_query;
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
                author_proof_identities: row.try_get("author_proof_identities")?,
                author_public_key: row.try_get("author_public_key")?,
                content: row.try_get("content")?,
                // shy_proof_id: row.try_get("shy_proof_id")?,
                author_sig: row.try_get("author_sig")?,
                participant_proof_identities: row.try_get("participant_proof_identities")?,
                sub_channel_id: row.try_get("sub_channel_id")?,
                total_like_count: row.try_get("total_like_count")?,
                // other_proof_ids: row.try_get("other_proof_ids")?,
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
    let query = get_shy_topic_query();
    let row = sqlx::query(&query).bind(topic_id).fetch_one(pool).await?;

    let topic = ShyTopic {
        title: row.try_get("title")?,
        topic_id: row.try_get("topic_id")?,
        channel_id: row.try_get("channel_id")?,
        total_reply_count: row.try_get("total_reply_count")?,
        author_proof_identities: row.try_get("author_proof_identities")?,
        author_public_key: row.try_get("author_public_key")?,
        content: row.try_get("content")?,
        // shy_proof_id: row.try_get("shy_proof_id")?,
        author_sig: row.try_get("author_sig")?,
        participant_proof_identities: row.try_get("participant_proof_identities")?,
        sub_channel_id: row.try_get("sub_channel_id")?,
        total_like_count: row.try_get("total_like_count")?,
        // other_proof_ids: row.try_get("other_proof_ids")?,
    };
    let topic = DateTimed {
        inner: topic,
        created_at: row.try_get("created_at")?,
        updated_at: row.try_get("updated_at")?,
    };

    Ok(topic)
}

#[allow(non_snake_case)]
pub async fn get_shy_topic__tx(
    tx: &mut Transaction<'_, Postgres>,
    topic_id: &String,
) -> Result<DateTimed<ShyTopic>, ShyDbInterfaceError> {
    let query = get_shy_topic_query();

    let row = sqlx::query(&query)
        .bind(topic_id)
        .fetch_one(&mut **tx)
        .await?;

    let topic = ShyTopic {
        title: row.try_get("title")?,
        topic_id: row.try_get("topic_id")?,
        channel_id: row.try_get("channel_id")?,
        total_reply_count: row.try_get("total_reply_count")?,
        author_proof_identities: row.try_get("author_proof_identities")?,
        author_public_key: row.try_get("author_public_key")?,
        content: row.try_get("content")?,
        // shy_proof_id: row.try_get("shy_proof_id")?,
        author_sig: row.try_get("author_sig")?,
        participant_proof_identities: row.try_get("participant_proof_identities")?,
        sub_channel_id: row.try_get("sub_channel_id")?,
        total_like_count: row.try_get("total_like_count")?,
        // other_proof_ids: row.try_get("other_proof_ids")?,
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
(topic_id, channel_id, title, total_reply_count, content, participant_proof_identities, 
sub_channel_id, total_like_count, author_proof_identities)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
ON CONFLICT (topic_id) DO UPDATE SET (
total_reply_count, title, content, updated_at
) = (
excluded.total_reply_count, excluded.title, excluded.content, now()
)
RETURNING topic_id
"#;

    let row = sqlx::query(query)
        .bind(&shy_topic.topic_id)
        .bind(&shy_topic.channel_id)
        .bind(&shy_topic.title)
        // .bind(&shy_topic.author_public_key)
        .bind(&shy_topic.total_reply_count)
        .bind(&shy_topic.content)
        // .bind(&shy_topic.shy_proof_id)
        // .bind(&shy_topic.author_sig)
        .bind(&shy_topic.participant_proof_identities)
        .bind(&shy_topic.sub_channel_id)
        .bind(&shy_topic.total_like_count)
        // .bind(&shy_topic.other_proof_ids)
        .bind(&shy_topic.author_proof_identities)
        .fetch_one(&mut **tx)
        .await?;

    let topic_id: String = row
        .try_get("topic_id")
        .map_err(|err| format!("Insert shy topic failed, err: {}", err))?;

    Ok(topic_id)
}
