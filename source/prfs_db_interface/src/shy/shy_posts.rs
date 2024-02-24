use prfs_entities::sqlx::{self, Pool, Postgres, Row, Transaction};
use shy_entities::entities::ShyPost;

use crate::DbInterfaceError;

pub async fn get_shy_posts(
    pool: &Pool<Postgres>,
    offset: i32,
    limit: i32,
) -> Result<Vec<ShyPost>, DbInterfaceError> {
    let query = r#"
SELECT * 
FROM shy_posts 
ORDER BY updated_at DESC
OFFSET $1
LIMIT $2
"#;

    let rows = sqlx::query(&query)
        .bind(offset)
        .bind(limit)
        .fetch_all(pool)
        .await
        .unwrap();

    let shy_posts: Vec<ShyPost> = rows
        .iter()
        .map(|row| ShyPost {
            post_id: row.get("post_id"),
            content: row.get("content"),
            channel_id: row.get("channel_id"),
        })
        .collect();

    Ok(shy_posts)
}

pub async fn insert_shy_post(tx: &mut Transaction<'_, Postgres>, shy_post: &ShyPost) -> uuid::Uuid {
    let query = r#"
INSERT INTO shy_posts
(post_id, content, channel_id)
VALUES ($1, $2, $3)
RETURNING post_id
"#;

    let row = sqlx::query(query)
        .bind(&shy_post.post_id)
        .bind(&shy_post.content)
        .bind(&shy_post.channel_id)
        .fetch_one(&mut **tx)
        .await
        .unwrap();

    let post_id: uuid::Uuid = row.get("post_id");

    post_id
}
