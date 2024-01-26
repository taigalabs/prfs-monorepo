use crate::DbInterfaceError;
use prfs_entities::entities::{PrfsCryptoAssetSizeAtst, PrfsSetElement};
use prfs_entities::sqlx::{self, Pool, Postgres, Row, Transaction};

pub async fn insert_prfs_set_element(
    tx: &mut Transaction<'_, Postgres>,
    set_element: &PrfsSetElement,
) -> Result<String, DbInterfaceError> {
    let query = r#"
INSERT INTO prfs_set_elements
(name, set_id, ref, data, status)
VALUES ($1, $2, $3, $4)
ON CONFLICT (name, set_id) DO UPDATE SET (
name, set_id, ref, data, status, updated_at
) = (
excluded.name, excluded.set_id, excluded.ref, excluded.data, excluded.status
now()
)
RETURNING atst_id"#;

    let row = sqlx::query(query)
        .bind(&set_element.name)
        .bind(&set_element.set_id)
        .bind(&set_element.r#ref)
        .bind(&set_element.data)
        .bind(&set_element.status)
        .fetch_one(&mut **tx)
        .await?;

    let name: String = row.get("name");

    return Ok(name);
}

pub async fn get_prfs_set_elements(
    pool: &Pool<Postgres>,
    set_id: &String,
    offset: i32,
    limit: i32,
) -> Result<Vec<PrfsSetElement>, DbInterfaceError> {
    let query = r#"
SELECT *
FROM prfs_set_elements
WHERE set_id=$1
LIMIT $2
OFFSET $3
"#;

    let rows = sqlx::query(query)
        .bind(set_id)
        .bind(limit)
        .bind(offset)
        .fetch_all(pool)
        .await?;

    let atsts = rows
        .iter()
        .map(|row| PrfsSetElement {
            name: row.get("name"),
            data: row.get("data"),
            r#ref: row.get("ref"),
            status: row.get("status"),
            set_id: row.get("set_id"),
        })
        .collect();

    Ok(atsts)
}

pub async fn get_prfs_set_element(
    pool: &Pool<Postgres>,
    set_id: &String,
    atst_id: &String,
) -> Result<PrfsSetElement, DbInterfaceError> {
    let query = r#"
SELECT *
FROM prfs_set_elements
WHERE set_id=$1
WHERE atst_id=$2
"#;

    let row = sqlx::query(query)
        .bind(&set_id)
        .bind(&atst_id)
        .fetch_one(pool)
        .await?;

    let atst = PrfsSetElement {
        name: row.get("name"),
        data: row.get("data"),
        r#ref: row.get("ref"),
        status: row.get("status"),
        set_id: row.get("set_id"),
    };

    Ok(atst)
}
