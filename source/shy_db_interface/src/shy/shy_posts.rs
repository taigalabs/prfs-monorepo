use prfs_db_driver::sqlx::{self, Pool, Postgres, Row, Transaction};
use shy_entities::{DateTimed, ShyPost, ShyPostSyn1};

use crate::ShyDbInterfaceError;

pub async fn insert_shy_post(
    tx: &mut Transaction<'_, Postgres>,
    shy_post: &ShyPost,
) -> Result<String, ShyDbInterfaceError> {
    let query = r#"
INSERT INTO shy_posts
(topic_id, content, post_id, channel_id, shy_proof_id, author_public_key, author_sig,
author_proof_identity_inputs)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING post_id
"#;

    let row = sqlx::query(query)
        .bind(&shy_post.topic_id)
        .bind(&shy_post.content)
        .bind(&shy_post.post_id)
        .bind(&shy_post.channel_id)
        .bind(&shy_post.shy_proof_id)
        .bind(&shy_post.author_public_key)
        .bind(&shy_post.author_sig)
        .bind(&shy_post.author_proof_identity_inputs)
        .fetch_one(&mut **tx)
        .await?;

    let post_id: String = row
        .try_get("post_id")
        .map_err(|err| format!("Failed to insert shy post, err: {}", err))?;

    Ok(post_id)
}

pub async fn get_shy_posts_syn1_of_topic(
    pool: &Pool<Postgres>,
    topic_id: &String,
    offset: i32,
    limit: i32,
) -> Result<Vec<DateTimed<ShyPostSyn1>>, ShyDbInterfaceError> {
    let query = r#"
SELECT p.*, f.*, pt.*
FROM shy_posts p
INNER JOIN shy_proofs f ON f.shy_proof_id = p.shy_proof_id
INNER JOIN prfs_proof_types pt ON pt.proof_type_id = f.proof_type_id
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
                    shy_proof_id: row.try_get("shy_proof_id")?,
                    author_public_key: row.try_get("author_public_key")?,
                    author_sig: row.try_get("author_sig")?,
                    author_proof_identity_inputs: row.try_get("author_proof_identity_inputs")?,
                },
                img_url: row.try_get("img_url")?,
                expression: row.try_get("expression")?,
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
