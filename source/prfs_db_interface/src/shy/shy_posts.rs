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
                public_key: row.try_get("public_key")?,
                shy_post_proof_id: row.try_get("shy_post_proof_id")?,
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

pub async fn get_shy_post(
    pool: &Pool<Postgres>,
    post_id: &String,
) -> Result<DateTimed<ShyPost>, DbInterfaceError> {
    let query = r#"
SELECT * 
FROM shy_posts 
WHERE post_id=$1
"#;

    let row = sqlx::query(&query).bind(post_id).fetch_one(pool).await?;

    let post_ = ShyPost {
        title: row.try_get("title")?,
        post_id: row.try_get("post_id")?,
        content: row.try_get("content")?,
        channel_id: row.try_get("channel_id")?,
        shy_post_proof_id: row.try_get("shy_post_proof_id")?,
        proof_identity_input: row.try_get("proof_identity_input")?,
        num_replies: row.try_get("num_replies")?,
        public_key: row.try_get("public_key")?,
    };
    let post = DateTimed {
        inner: post_,
        created_at: row.try_get("created_at")?,
        updated_at: row.try_get("updated_at")?,
    };

    Ok(post)
}

pub async fn insert_shy_post(
    tx: &mut Transaction<'_, Postgres>,
    shy_post: &ShyPost,
) -> Result<String, DbInterfaceError> {
    let query = r#"
INSERT INTO shy_posts
(post_id, content, channel_id, shy_post_proof_id, title, proof_identity_input, public_key)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING post_id
"#;

    let row = sqlx::query(query)
        .bind(&shy_post.post_id)
        .bind(&shy_post.content)
        .bind(&shy_post.channel_id)
        .bind(&shy_post.shy_post_proof_id)
        .bind(&shy_post.title)
        .bind(&shy_post.proof_identity_input)
        .bind(&shy_post.public_key)
        .fetch_one(&mut **tx)
        .await?;

    let post_id: String = row.try_get("post_id")?;
    Ok(post_id)
}
