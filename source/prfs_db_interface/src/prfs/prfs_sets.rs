use chrono::{DateTime, Utc};
use prfs_db_driver::sqlx::{self, Pool, Postgres, Row, Transaction};
use prfs_entities::entities::PrfsSet;
use prfs_entities::prfs_api::PrfsSetIns1;

use crate::DbInterfaceError;

pub async fn get_prfs_set_by_set_id(
    pool: &Pool<Postgres>,
    set_id: &String,
) -> Result<PrfsSet, DbInterfaceError> {
    let query = r#"
SELECT * 
FROM prfs_sets 
WHERE set_id=$1
"#;

    let row = sqlx::query(&query).bind(&set_id).fetch_one(pool).await?;

    let set_id: String = row.try_get("set_id")?;
    let label: String = row.try_get("label")?;
    let author: String = row.try_get("author")?;
    let desc: String = row.try_get("desc")?;
    let hash_algorithm: String = row.try_get("hash_algorithm")?;
    let cardinality: i64 = row.try_get("cardinality")?;
    let created_at: DateTime<Utc> = row.try_get("created_at")?;
    let element_type: String = row.try_get("element_type")?;
    // let set_type: PrfsSetType = row.try_get("set_type")?;
    let topic: String = row.try_get("topic")?;

    let s = PrfsSet {
        set_id,
        label,
        author,
        desc,
        hash_algorithm,
        cardinality,
        created_at,
        element_type,
        // set_type,
        topic,
    };

    Ok(s)
}

pub async fn get_prfs_sets(
    pool: &Pool<Postgres>,
    page_idx: i32,
    page_size: i32,
) -> Result<Vec<PrfsSet>, DbInterfaceError> {
    let query = r#"
SELECT * 
FROM prfs_sets
ORDER BY created_at
LIMIT $1
OFFSET $2
"#;

    let offset = page_idx * page_size;

    let rows = sqlx::query(&query)
        .bind(page_size)
        .bind(offset)
        .fetch_all(pool)
        .await?;

    let prfs_sets: Vec<PrfsSet> = rows
        .iter()
        .map(|r| {
            let set_id: String = r.try_get("set_id")?;
            let label: String = r.try_get("label")?;
            let author: String = r.try_get("author")?;
            let desc: String = r.try_get("desc")?;
            let hash_algorithm: String = r.try_get("hash_algorithm")?;
            let cardinality: i64 = r.try_get("cardinality")?;
            // let set_type: PrfsSetType = r.try_get("set_type")?;
            let created_at: DateTime<Utc> = r.try_get("created_at")?;
            let element_type: String = r.try_get("element_type")?;
            let topic: String = r.try_get("topic")?;

            Ok(PrfsSet {
                set_id,
                label,
                author,
                desc,
                hash_algorithm,
                cardinality,
                created_at,
                element_type,
                // set_type,
                topic,
            })
        })
        .collect::<Result<Vec<PrfsSet>, DbInterfaceError>>()?;

    Ok(prfs_sets)
}

pub async fn get_prfs_sets_by_topic(
    pool: &Pool<Postgres>,
    topic: &String,
) -> Result<Vec<PrfsSet>, DbInterfaceError> {
    let query = r#"
SELECT * 
FROM prfs_sets
WHERE topic=$1
"#;

    let rows = sqlx::query(&query).bind(&topic).fetch_all(pool).await?;

    let prfs_sets: Vec<PrfsSet> = rows
        .iter()
        .map(|r| {
            let set_id: String = r.try_get("set_id")?;
            let label: String = r.try_get("label")?;
            let author: String = r.try_get("author")?;
            let desc: String = r.try_get("desc")?;
            let hash_algorithm: String = r.try_get("hash_algorithm")?;
            let cardinality: i64 = r.try_get("cardinality")?;
            // let set_type: PrfsSetType = r.try_get("set_type")?;
            let created_at: DateTime<Utc> = r.try_get("created_at")?;
            let element_type: String = r.try_get("element_type")?;
            let topic: String = r.try_get("topic")?;

            Ok(PrfsSet {
                set_id,
                label,
                author,
                desc,
                hash_algorithm,
                cardinality,
                created_at,
                element_type,
                // set_type,
                topic,
            })
        })
        .collect::<Result<Vec<PrfsSet>, DbInterfaceError>>()?;

    Ok(prfs_sets)
}

pub async fn get_prfs_sets_by_set_type(
    pool: &Pool<Postgres>,
    // set_type: PrfsSetType,
    page_idx: i32,
    page_size: i32,
) -> Result<Vec<PrfsSet>, DbInterfaceError> {
    let query = r#"
SELECT * 
FROM prfs_sets
ORDER BY created_at
LIMIT $2
OFFSET $3
"#;

    let offset = page_idx * page_size;

    let rows = sqlx::query(&query)
        .bind(page_size)
        .bind(offset)
        .fetch_all(pool)
        .await?;

    let prfs_sets: Vec<PrfsSet> = rows
        .iter()
        .map(|r| {
            let set_id: String = r.try_get("set_id")?;
            let label: String = r.try_get("label")?;
            let author: String = r.try_get("author")?;
            let desc: String = r.try_get("desc")?;
            let hash_algorithm: String = r.try_get("hash_algorithm")?;
            let cardinality: i64 = r.try_get("cardinality")?;
            let created_at: DateTime<Utc> = r.try_get("created_at")?;
            let element_type: String = r.try_get("element_type")?;
            // let set_type: PrfsSetType = r.try_get("set_type")?;
            let topic: String = r.try_get("topic")?;

            Ok(PrfsSet {
                set_id,
                label,
                author,
                desc,
                hash_algorithm,
                cardinality,
                created_at,
                element_type,
                // set_type,
                topic,
            })
        })
        .collect::<Result<Vec<PrfsSet>, DbInterfaceError>>()?;

    Ok(prfs_sets)
}

pub async fn insert_prfs_set_ins1(
    tx: &mut Transaction<'_, Postgres>,
    prfs_set: &PrfsSetIns1,
) -> Result<String, DbInterfaceError> {
    let query = r#"
INSERT INTO prfs_sets 
(set_id, label, author, "desc", hash_algorithm, cardinality,
merkle_root, element_type, finite_field, elliptic_curve, tree_depth, topic) 
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
RETURNING set_id"#;

    let row = sqlx::query(&query)
        .bind(&prfs_set.set_id)
        // .bind(&prfs_set.set_type)
        .bind(&prfs_set.label)
        .bind(&prfs_set.author)
        .bind(&prfs_set.desc)
        .bind(&prfs_set.hash_algorithm)
        .bind(&prfs_set.cardinality)
        .bind(&prfs_set.merkle_root)
        .bind(&prfs_set.element_type)
        .bind(&prfs_set.finite_field)
        .bind(&prfs_set.elliptic_curve)
        .bind(&prfs_set.tree_depth)
        .bind(&prfs_set.topic)
        .fetch_one(&mut **tx)
        .await
        .expect(&format!("insertion failed, set_id: {}", prfs_set.set_id));

    let set_id: String = row.get("set_id");

    return Ok(set_id);
}

pub async fn insert_prfs_set(
    tx: &mut Transaction<'_, Postgres>,
    prfs_set: &PrfsSet,
) -> Result<String, DbInterfaceError> {
    let query = r#"
INSERT INTO prfs_sets (set_id, label, author, "desc", hash_algorithm, cardinality,
element_type, topic)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
"#;

    let row = sqlx::query(&query)
        .bind(&prfs_set.set_id)
        // .bind(&prfs_set.set_type)
        .bind(&prfs_set.label)
        .bind(&prfs_set.author)
        .bind(&prfs_set.desc)
        .bind(&prfs_set.hash_algorithm)
        .bind(&prfs_set.cardinality)
        .bind(&prfs_set.element_type)
        .bind(&prfs_set.topic)
        .fetch_one(&mut **tx)
        .await?;

    let set_id: String = row.try_get("set_id")?;

    Ok(set_id)
}

pub async fn upsert_prfs_set(
    tx: &mut Transaction<'_, Postgres>,
    prfs_set: &PrfsSet,
) -> Result<String, DbInterfaceError> {
    let query = r#"
INSERT INTO prfs_sets (set_id, label, author, "desc", hash_algorithm, cardinality,
element_type, topic) 
VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
ON CONFLICT (set_id) 
DO UPDATE SET (cardinality,updated_at) = (excluded.cardinality, now())
RETURNING set_id
"#;

    let row = sqlx::query(&query)
        .bind(&prfs_set.set_id)
        // .bind(&prfs_set.set_type)
        .bind(&prfs_set.label)
        .bind(&prfs_set.author)
        .bind(&prfs_set.desc)
        .bind(&prfs_set.hash_algorithm)
        .bind(&prfs_set.cardinality)
        .bind(&prfs_set.element_type)
        .bind(&prfs_set.topic)
        .fetch_one(&mut **tx)
        .await?;

    let set_id: String = row.try_get("set_id")?;

    Ok(set_id)
}
