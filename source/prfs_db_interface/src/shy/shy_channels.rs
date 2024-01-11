use crate::{
    database2::Database2,
    utils::{concat_cols, concat_values},
    DbInterfaceError,
};
use chrono::{DateTime, Utc};
use prfs_entities::{
    entities::{PrfsSet, PrfsSetType},
    shy_api_entities::ShyPost,
};
use prfs_entities::{
    shy_api_entities::ShyChannel,
    sqlx::{self, Pool, Postgres, QueryBuilder, Row, Transaction},
};

pub async fn get_shy_channels(
    pool: &Pool<Postgres>,
    offset: i32,
    limit: i32,
) -> Result<Vec<ShyChannel>, DbInterfaceError> {
    let query = r#"
SELECT * 
FROM shy_channels
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

    let shy_channels: Vec<ShyChannel> = rows
        .iter()
        .map(|row| ShyChannel {
            channel_id: row.get("channel_id"),
            label: row.get("label"),
        })
        .collect();

    Ok(shy_channels)
}

// pub async fn insert_shy_post(tx: &mut Transaction<'_, Postgres>, shy_post: &ShyPost) -> uuid::Uuid {
//     let query = r#"
// INSERT INTO shy_posts
// (post_id, content, channel_id)
// VALUES ($1, $2, $3)
// RETURNING post_id
// "#;

//     let row = sqlx::query(query)
//         .bind(&shy_post.post_id)
//         .bind(&shy_post.content)
//         .bind(&shy_post.channel_id)
//         .fetch_one(&mut **tx)
//         .await
//         .unwrap();

//     let post_id: uuid::Uuid = row.get("post_id");

//     post_id
// }
