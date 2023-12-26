use crate::{
    database2::Database2,
    utils::{concat_cols, concat_values},
    DbInterfaceError,
};
use chrono::{DateTime, Utc};
use prfs_entities::sqlx::{self, Pool, Postgres, QueryBuilder, Row, Transaction};
use prfs_entities::{
    entities::{PrfsSet, PrfsSetType},
    shy_api_entities::ShyPost,
};
use uuid::Uuid;

pub async fn get_shy_posts(
    pool: &Pool<Postgres>,
    page_idx: i32,
    page_size: i32,
) -> Result<Vec<ShyPost>, DbInterfaceError> {
    let query = r#"
SELECT * 
FROM shy_posts 
ORDER BY updated_at DESC"#;

    let rows = sqlx::query(&query).fetch_all(pool).await.unwrap();

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
    let query = "INSERT INTO shy_posts \
            (post_id, content, channel_id)
            VALUES ($1, $2, $3) returning post_id";

    // let proof_instance = social_post.get(0).unwrap();

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
