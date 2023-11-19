use crate::{
    database2::Database2,
    utils::{concat_cols, concat_values},
    DbInterfaceError,
};
use chrono::{DateTime, Utc};
use prfs_entities::{
    entities::SocialPost,
    sqlx::{self, Pool, Postgres, QueryBuilder, Row, Transaction},
};
use prfs_entities::{
    entities::{PrfsSet, PrfsSetType},
    syn_entities::PrfsSetIns1,
};
use uuid::Uuid;

pub async fn get_social_posts(
    pool: &Pool<Postgres>,
    page_idx: i32,
    page_size: i32,
) -> Result<Vec<SocialPost>, DbInterfaceError> {
    let query = format!("SELECT * from social_posts");

    let rows = sqlx::query(&query).fetch_all(pool).await.unwrap();

    let social_posts: Vec<SocialPost> = rows
        .iter()
        .map(|row| SocialPost {
            post_id: row.get("post_id"),
            content: row.get("content"),
            channel_id: row.get("channel_id"),
        })
        .collect();

    Ok(social_posts)
}

pub async fn insert_social_post(
    tx: &mut Transaction<'_, Postgres>,
    social_post: &SocialPost,
) -> uuid::Uuid {
    let query = "INSERT INTO social_posts \
            (post_id, content, channel_id)
            VALUES ($1, $2, $3) returning post_id";

    // let proof_instance = social_post.get(0).unwrap();

    let row = sqlx::query(query)
        .bind(&social_post.post_id)
        .bind(&social_post.content)
        .bind(&social_post.channel_id)
        .fetch_one(&mut **tx)
        .await
        .unwrap();

    let post_id: uuid::Uuid = row.get("post_id");

    post_id
}
