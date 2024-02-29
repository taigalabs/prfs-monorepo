use prfs_entities::sqlx::{self, Pool, Postgres, Row, Transaction};
use shy_entities::entities::{DateTimed, ShyPost};

use crate::DbInterfaceError;

pub async fn get_shy_posts(
    pool: &Pool<Postgres>,
    channel_id: &String,
    offset: i32,
    limit: i32,
) -> Result<Vec<DateTimed<ShyPost>>, DbInterfaceError> {
    let query = r#"
SELECT * 
FROM shy_posts 
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

    let shy_posts = rows
        .iter()
        .map(|row| {
            let post_ = ShyPost {
                title: row.try_get("title")?,
                post_id: row.try_get("post_id")?,
                content: row.try_get("content")?,
                channel_id: row.try_get("channel_id")?,
                proof_identity_input: row.try_get("proof_identity_input")?,
                num_replies: row.try_get("num_replies")?,
            };

            let post = DateTimed {
                inner: post_,
                created_at: row.try_get("created_at")?,
                updated_at: row.try_get("updated_at")?,
            };

            return Ok(post);
        })
        .collect::<Result<Vec<DateTimed<ShyPost>>, DbInterfaceError>>()?;

    Ok(shy_posts)
}

pub async fn insert_shy_post(
    tx: &mut Transaction<'_, Postgres>,
    title: &String,
    post_id: &String,
    content: &String,
    channel_id: &String,
    proof_id: &String,
    proof_identity_input: &String,
) -> Result<String, DbInterfaceError> {
    let query = r#"
INSERT INTO shy_posts
(post_id, content, channel_id, shy_post_proof_id, title, proof_identity_input)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING post_id
"#;

    let row = sqlx::query(query)
        .bind(&post_id)
        .bind(&content)
        .bind(&channel_id)
        .bind(&proof_id)
        .bind(&title)
        .bind(&proof_identity_input)
        .fetch_one(&mut **tx)
        .await?;

    let post_id: String = row.try_get("post_id")?;
    Ok(post_id)
}
