use chrono::{DateTime, Utc};
use prfs_entities::entities::{PrfsSet, PrfsSetType};
use prfs_entities::prfs_api::PrfsSetIns1;
use prfs_entities::sqlx::{self, Pool, Postgres, Row, Transaction};

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

    let row = sqlx::query(&query)
        .bind(&set_id)
        .fetch_one(pool)
        .await
        .unwrap();

    let set_id: String = row.try_get("set_id").expect("invalid set_id");
    let label: String = row.try_get("label").expect("invalid label");
    let author: String = row.try_get("author").expect("invalid author");
    let desc: String = row.try_get("desc").expect("invalid desc");
    let hash_algorithm: String = row
        .try_get("hash_algorithm")
        .expect("invalid hash_algorithm");
    let cardinality: i64 = row.try_get("cardinality").expect("invalid cardinality");
    let created_at: DateTime<Utc> = row.try_get("created_at").expect("invalid created_at");
    let element_type: String = row.try_get("element_type").expect("invalid element_type");
    let set_type: PrfsSetType = row.try_get("set_type").expect("invalid set_type");

    let s = PrfsSet {
        set_id,
        label,
        author,
        desc,
        hash_algorithm,
        cardinality,
        created_at,
        element_type,
        set_type,
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
        .await
        .unwrap();

    let prfs_sets: Vec<PrfsSet> = rows
        .iter()
        .map(|r| {
            let set_id: String = r.try_get("set_id").expect("invalid set_id");
            let label: String = r.try_get("label").expect("invalid label");
            let author: String = r.try_get("author").expect("invalid author");
            let desc: String = r.try_get("desc").expect("invalid desc");
            let hash_algorithm: String =
                r.try_get("hash_algorithm").expect("invalid hash_algorithm");
            let cardinality: i64 = r.try_get("cardinality").expect("invalid cardinality");
            let set_type: PrfsSetType = r.try_get("set_type").expect("invalid set_type");
            let created_at: DateTime<Utc> = r.try_get("created_at").expect("invalid created_at");
            let element_type: String = r.try_get("element_type").expect("invalid element_type");
            // let merkle_root: String = r.try_get("merkle_root").expect("invalid merkle_root");
            // let elliptic_curve: String =
            //     r.try_get("elliptic_curve").expect("invalid element_curve");
            // let finite_field: String = r.try_get("finite_field").expect("invalid finite_field");
            // let tree_depth: i16 = r.get("tree_depth");

            PrfsSet {
                set_id,
                label,
                author,
                desc,
                hash_algorithm,
                cardinality,
                created_at,
                element_type,
                set_type,
            }
        })
        .collect();

    Ok(prfs_sets)
}

pub async fn get_prfs_sets_by_set_type(
    pool: &Pool<Postgres>,
    set_type: PrfsSetType,
    page_idx: i32,
    page_size: i32,
) -> Result<Vec<PrfsSet>, DbInterfaceError> {
    let query = r#"
SELECT * 
FROM prfs_sets
WHERE set_type=$1
ORDER BY created_at
LIMIT $2
OFFSET $3
"#;

    let offset = page_idx * page_size;

    let rows = sqlx::query(&query)
        .bind(set_type)
        .bind(page_size)
        .bind(offset)
        .fetch_all(pool)
        .await
        .unwrap();

    let prfs_sets: Vec<PrfsSet> = rows
        .iter()
        .map(|r| {
            let set_id: String = r.try_get("set_id").expect("invalid set_id");
            let label: String = r.try_get("label").expect("invalid label");
            let author: String = r.try_get("author").expect("invalid author");
            let desc: String = r.try_get("desc").expect("invalid desc");
            let hash_algorithm: String =
                r.try_get("hash_algorithm").expect("invalid hash_algorithm");
            let cardinality: i64 = r.try_get("cardinality").expect("invalid cardinality");
            let created_at: DateTime<Utc> = r.try_get("created_at").expect("invalid created_at");
            let element_type: String = r.try_get("element_type").expect("invalid element_type");
            let set_type: PrfsSetType = r.try_get("set_type").expect("invalid set_type");

            PrfsSet {
                set_id,
                label,
                author,
                desc,
                hash_algorithm,
                cardinality,
                created_at,
                element_type,
                // tree_depth,
                // merkle_root,
                // elliptic_curve,
                // finite_field,
                set_type,
            }
        })
        .collect();

    Ok(prfs_sets)
}

pub async fn insert_prfs_set_ins1(
    tx: &mut Transaction<'_, Postgres>,
    prfs_set: &PrfsSetIns1,
) -> Result<String, DbInterfaceError> {
    let query = r#"
INSERT INTO prfs_sets 
(set_id, set_type, label, author, "desc", hash_algorithm, cardinality,
merkle_root, element_type, finite_field, elliptic_curve, tree_depth) 
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
RETURNING set_id"#;

    let row = sqlx::query(&query)
        .bind(&prfs_set.set_id)
        .bind(&prfs_set.set_type)
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
INSERT INTO prfs_sets (set_id, set_type, label, author, "desc", hash_algorithm, cardinality,
element_type)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
"#;

    let row = sqlx::query(&query)
        .bind(&prfs_set.set_id)
        .bind(&prfs_set.set_type)
        .bind(&prfs_set.label)
        .bind(&prfs_set.author)
        .bind(&prfs_set.desc)
        .bind(&prfs_set.hash_algorithm)
        .bind(&prfs_set.cardinality)
        .bind(&prfs_set.element_type)
        // .bind(&prfs_set.merkle_root)
        // .bind(&prfs_set.elliptic_curve)
        // .bind(&prfs_set.finite_field)
        // .bind(&prfs_set.tree_depth)
        .fetch_one(&mut **tx)
        .await
        .expect(&format!("insertion failed, set_id: {}", prfs_set.set_id));

    let set_id: String = row.try_get("set_id").unwrap();

    Ok(set_id)
}

pub async fn upsert_prfs_set(
    tx: &mut Transaction<'_, Postgres>,
    prfs_set: &PrfsSet,
) -> Result<String, DbInterfaceError> {
    let query = r#"
INSERT INTO prfs_sets (set_id, set_type, label, author, "desc", hash_algorithm, cardinality,
element_type) 
VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
ON CONFLICT (set_id) 
DO UPDATE SET (cardinality,updated_at) = (excluded.cardinality, now())
RETURNING set_id
"#;

    let row = sqlx::query(&query)
        .bind(&prfs_set.set_id)
        .bind(&prfs_set.set_type)
        .bind(&prfs_set.label)
        .bind(&prfs_set.author)
        .bind(&prfs_set.desc)
        .bind(&prfs_set.hash_algorithm)
        .bind(&prfs_set.cardinality)
        .bind(&prfs_set.element_type)
        // .bind(&prfs_set.merkle_root)
        // .bind(&prfs_set.elliptic_curve)
        // .bind(&prfs_set.finite_field)
        // .bind(&prfs_set.tree_depth)
        .fetch_one(&mut **tx)
        .await
        .expect(&format!("insertion failed, set_id: {}", prfs_set.set_id));

    let set_id: String = row.try_get("set_id").unwrap();

    Ok(set_id)
}
