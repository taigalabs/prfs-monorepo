use prfs_db_driver::sqlx::{self, Pool, Postgres, QueryBuilder, Row, Transaction};
use prfs_entities::entities::PrfsPoll;
use prfs_entities::prfs_api::CreatePrfsPollRequest;
use uuid::Uuid;

use crate::DbInterfaceError;

pub async fn get_prfs_polls(
    pool: &Pool<Postgres>,
    page_idx: i32,
    page_size: i32,
) -> Result<(Vec<PrfsPoll>, f32), DbInterfaceError> {
    let table_row_count: f32 = {
        let query = r#"
SELECT reltuples AS estimate 
FROM pg_class 
WHERE relname = 'prfs_proof_instances';
"#;

        let row = sqlx::query(query).fetch_one(pool).await?;
        row.try_get("estimate")?
    };

    let query = r#"
SELECT * FROM prfs_polls
"#;

    let rows = sqlx::query(query).fetch_all(pool).await?;

    let prfs_polls = rows
        .iter()
        .map(|row| {
            Ok(PrfsPoll {
                poll_id: row.get("poll_id"),
                label: row.get("label"),
                plural_voting: row.get("plural_voting"),
                proof_type_id: row.get("proof_type_id"),
                questions: row.get("questions"),
                description: row.get("description"),
                author: row.get("author"),
                created_at: row.get("created_at"),
            })
        })
        .collect::<Result<Vec<PrfsPoll>, DbInterfaceError>>()?;

    return Ok((prfs_polls, table_row_count));
}

pub async fn get_prfs_poll_by_poll_id(
    pool: &Pool<Postgres>,
    poll_id: &Uuid,
) -> Result<PrfsPoll, DbInterfaceError> {
    let query = r#"
SELECT *
FROM prfs_polls
WHERE poll_id=$1
"#;

    let row = sqlx::query(query).bind(&poll_id).fetch_one(pool).await?;

    let prfs_poll = PrfsPoll {
        poll_id: row.try_get("poll_id")?,
        label: row.try_get("label")?,
        plural_voting: row.try_get("plural_voting")?,
        proof_type_id: row.try_get("proof_type_id")?,
        description: row.try_get("description")?,
        questions: row.try_get("questions")?,
        author: row.try_get("author")?,
        created_at: row.try_get("created_at")?,
    };

    return Ok(prfs_poll);
}

pub async fn insert_prfs_poll(
    tx: &mut Transaction<'_, Postgres>,
    prfs_poll: &CreatePrfsPollRequest,
) -> Result<Uuid, DbInterfaceError> {
    let query = r#"
INSERT INTO prfs_polls
(poll_id, label, plural_voting, proof_type_id, author, questions, description)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING poll_id"#;

    let row = sqlx::query(query)
        .bind(&prfs_poll.poll_id)
        .bind(&prfs_poll.label)
        .bind(&prfs_poll.plural_voting)
        .bind(&prfs_poll.proof_type_id)
        .bind(&prfs_poll.author)
        .bind(&prfs_poll.questions)
        .bind(&prfs_poll.description)
        .fetch_one(&mut **tx)
        .await?;

    let poll_id: Uuid = row.try_get("poll_id")?;

    return Ok(poll_id);
}
