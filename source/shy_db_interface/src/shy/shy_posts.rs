use prfs_db_driver::sqlx::{self, Pool, Postgres, Row, Transaction};
use shy_entities::entities::{DateTimed, ShyPost, ShyPostSyn1};

use crate::ShyDbInterfaceError;

pub async fn insert_shy_post(
    tx: &mut Transaction<'_, Postgres>,
    shy_post: &ShyPost,
) -> Result<String, ShyDbInterfaceError> {
    let query = r#"
INSERT INTO shy_posts
(topic_id, content, post_id, channel_id, shy_topic_proof_id, author_public_key, author_sig)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING post_id
"#;

    let row = sqlx::query(query)
        .bind(&shy_post.topic_id)
        .bind(&shy_post.content)
        .bind(&shy_post.post_id)
        .bind(&shy_post.channel_id)
        .bind(&shy_post.shy_topic_proof_id)
        .bind(&shy_post.author_public_key)
        .bind(&shy_post.author_sig)
        .fetch_one(&mut **tx)
        .await?;

    let post_id: String = row
        .try_get("post_id")
        .map_err(|err| format!("Failed to insert shy post, err: {}", err))?;

    Ok(post_id)
}
