use prfs_db_driver::sqlx::{self, Pool, Postgres, Row, Transaction};
use shy_entities::entities::{DateTimed, ShyPost, ShyPostSyn1};

use crate::ShyDbInterfaceError;

pub async fn get_shy_posts_of_topic_syn1(
    pool: &Pool<Postgres>,
    topic_id: &String,
    offset: i32,
    limit: i32,
) -> Result<Vec<DateTimed<ShyPostSyn1>>, ShyDbInterfaceError> {
    let query = r#"
SELECT
p.*,
f.proof_identity_input
FROM shy_posts p
INNER JOIN shy_topic_proofs f ON f.shy_topic_proof_id = p.shy_topic_proof_id
WHERE p.topic_id=$1
ORDER BY p.updated_at ASC
OFFSET $2
LIMIT $3
"#;

    let rows = sqlx::query(&query)
        .bind(topic_id)
        .bind(offset)
        .bind(limit)
        .fetch_all(pool)
        .await?;

    let shy_posts = rows
        .iter()
        .map(|row| {
            let post_ = ShyPostSyn1 {
                shy_post: ShyPost {
                    post_id: row.try_get("post_id")?,
                    topic_id: row.try_get("topic_id")?,
                    content: row.try_get("content")?,
                    channel_id: row.try_get("channel_id")?,
                    shy_topic_proof_id: row.try_get("shy_topic_proof_id")?,
                    author_public_key: row.try_get("author_public_key")?,
                    author_sig: row.try_get("author_sig")?,
                },
                proof_identity_input: row.try_get("proof_identity_input")?,
            };

            let post = DateTimed {
                inner: post_,
                created_at: row.try_get("created_at")?,
                updated_at: row.try_get("updated_at")?,
            };

            return Ok(post);
        })
        .collect::<Result<Vec<DateTimed<ShyPostSyn1>>, ShyDbInterfaceError>>()?;

    Ok(shy_posts)
}
