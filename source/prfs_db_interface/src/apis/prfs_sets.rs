use crate::{
    database2::Database2,
    utils::{concat_cols, concat_values},
    DbInterfaceError,
};
use chrono::{DateTime, Utc};
use prfs_entities::entities::{PrfsSet, PrfsSetType};
use prfs_entities::sqlx::{self, Pool, Postgres, Row, Transaction};

pub async fn get_prfs_set_by_set_id(
    pool: &Pool<Postgres>,
    set_id: &uuid::Uuid,
) -> Result<PrfsSet, DbInterfaceError> {
    let query = format!("SELECT * from prfs_sets where set_id=$1");

    let row = sqlx::query(&query)
        .bind(&set_id)
        .fetch_one(pool)
        .await
        .unwrap();

    let set_id: uuid::Uuid = row.try_get("set_id").expect("invalid set_id");
    let label: String = row.try_get("label").expect("invalid label");
    let author: String = row.try_get("author").expect("invalid author");
    let desc: String = row.try_get("desc").expect("invalid desc");
    let hash_algorithm: String = row
        .try_get("hash_algorithm")
        .expect("invalid hash_algorithm");
    let cardinality: i64 = row.try_get("cardinality").expect("invalid cardinality");
    let created_at: DateTime<Utc> = row.try_get("created_at").expect("invalid created_at");
    let merkle_root: String = row.try_get("merkle_root").expect("invalid merkle_root");
    let element_type: String = row.try_get("element_type").expect("invalid element_type");
    let elliptic_curve: String = row
        .try_get("elliptic_curve")
        .expect("invalid element_curve");
    let finite_field: String = row.try_get("finite_field").expect("invalid finite_field");
    let set_type: PrfsSetType = row.try_get("set_type").expect("invalid set_type");

    let s = PrfsSet {
        set_id,
        label,
        author,
        desc,
        hash_algorithm,
        cardinality,
        created_at,
        merkle_root,
        element_type,
        elliptic_curve,
        finite_field,
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
            let set_id: uuid::Uuid = r.try_get("set_id").expect("invalid set_id");
            let label: String = r.try_get("label").expect("invalid label");
            let author: String = r.try_get("author").expect("invalid author");
            let desc: String = r.try_get("desc").expect("invalid desc");
            let hash_algorithm: String =
                r.try_get("hash_algorithm").expect("invalid hash_algorithm");
            let cardinality: i64 = r.try_get("cardinality").expect("invalid cardinality");
            let created_at: DateTime<Utc> = r.try_get("created_at").expect("invalid created_at");
            let merkle_root: String = r.try_get("merkle_root").expect("invalid merkle_root");
            let element_type: String = r.try_get("element_type").expect("invalid element_type");
            let elliptic_curve: String =
                r.try_get("elliptic_curve").expect("invalid element_curve");
            let finite_field: String = r.try_get("finite_field").expect("invalid finite_field");
            let set_type: PrfsSetType = r.try_get("set_type").expect("invalid set_type");

            PrfsSet {
                set_id,
                label,
                author,
                desc,
                hash_algorithm,
                cardinality,
                created_at,
                merkle_root,
                element_type,
                elliptic_curve,
                finite_field,
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
            let set_id: uuid::Uuid = r.try_get("set_id").expect("invalid set_id");
            let label: String = r.try_get("label").expect("invalid label");
            let author: String = r.try_get("author").expect("invalid author");
            let desc: String = r.try_get("desc").expect("invalid desc");
            let hash_algorithm: String =
                r.try_get("hash_algorithm").expect("invalid hash_algorithm");
            let cardinality: i64 = r.try_get("cardinality").expect("invalid cardinality");
            let created_at: DateTime<Utc> = r.try_get("created_at").expect("invalid created_at");
            let merkle_root: String = r.try_get("merkle_root").expect("invalid merkle_root");
            let element_type: String = r.try_get("element_type").expect("invalid element_type");
            let elliptic_curve: String =
                r.try_get("elliptic_curve").expect("invalid element_curve");
            let finite_field: String = r.try_get("finite_field").expect("invalid finite_field");
            let set_type: PrfsSetType = r.try_get("set_type").expect("invalid set_type");

            PrfsSet {
                set_id,
                label,
                author,
                desc,
                hash_algorithm,
                cardinality,
                created_at,
                merkle_root,
                element_type,
                elliptic_curve,
                finite_field,
                set_type,
            }
        })
        .collect();

    Ok(prfs_sets)
}

pub async fn insert_prfs_set(
    tx: &mut Transaction<'_, Postgres>,
    prfs_set: &PrfsSet,
    update_on_conflict: bool,
) -> Result<String, DbInterfaceError> {
    let cols = concat_cols(&[
        "set_id",
        "label",
        "author",
        "desc",
        "hash_algorithm",
        "cardinality",
        "merkle_root",
        "element_type",
        "elliptic_curve",
        "finite_field",
    ]);

    let vals = concat_values(&[
        &prfs_set.set_id.to_string(),
        &prfs_set.label,
        &prfs_set.author,
        &prfs_set.desc,
        &prfs_set.hash_algorithm,
        &prfs_set.cardinality.to_string(),
        &prfs_set.merkle_root,
        &prfs_set.element_type,
        &prfs_set.elliptic_curve,
        &prfs_set.finite_field,
    ]);

    let query = if update_on_conflict {
        format!(
            "INSERT INTO prfs_sets ({}) VALUES ({}) \
                ON CONFLICT (set_id) DO UPDATE SET cardinality = excluded.cardinality, \
                merkle_root = excluded.merkle_root, updated_at = now() returning set_id",
            cols, vals,
        )
    } else {
        format!(
            "INSERT INTO prfs_sets ({}) VALUES ({}) \
                ON CONFLICT DO NOTHING returning set_id",
            cols, vals,
        )
    };

    println!("query: {}", query);

    let row = sqlx::query(&query)
        .fetch_one(&mut **tx)
        .await
        .expect(&format!("insertion failed, set_id: {}", prfs_set.set_id));

    let set_id: String = row.try_get("set_id").unwrap();

    Ok(set_id)
}
