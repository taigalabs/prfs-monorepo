use prfs_db_driver::bind_limit::BIND_LIMIT;
use prfs_db_driver::sqlx::{self, Pool, Postgres, QueryBuilder, Row, Transaction};
use prfs_entities::entities::PrfsSetElement;

use super::queries::get_prfs_set_elements_query;
use crate::DbInterfaceError;

pub async fn insert_atsts_as_prfs_set_elements(
    tx: &mut Transaction<'_, Postgres>,
    prfs_set_elements: Vec<PrfsSetElement>,
) -> Result<u64, DbInterfaceError> {
    let mut query_builder: QueryBuilder<Postgres> = QueryBuilder::new(
        r#"
INSERT INTO prfs_set_elements 
(element_id, data, ref, set_id, element_idx, status)
"#,
    );

    query_builder.push_values(
        prfs_set_elements.iter().take(BIND_LIMIT / 5).enumerate(),
        |mut b, (_, elem)| {
            b.push_bind(&elem.element_id)
                .push_bind(&elem.data)
                .push_bind(&elem.r#ref)
                .push_bind(&elem.set_id)
                .push_bind(&elem.element_idx)
                .push_bind(&elem.status);
        },
    );

    query_builder.push(
        r#"
ON CONFLICT (set_id, element_id) DO UPDATE SET (
element_id, data, ref, element_idx, status
) = (excluded.element_id, excluded.data, excluded.ref, excluded.element_idx, excluded.status)
    "#,
    );

    let query = query_builder.build();
    let res = query.execute(&mut **tx).await?;
    return Ok(res.rows_affected());
}

pub async fn insert_prfs_set_element(
    tx: &mut Transaction<'_, Postgres>,
    set_element: &PrfsSetElement,
) -> Result<String, DbInterfaceError> {
    let query = r#"
INSERT INTO prfs_set_elements
(element_id, set_id, ref, data, status)
VALUES ($1, $2, $3, $4)
ON CONFLICT (element_id, set_id) DO UPDATE SET (
element_id, set_id, ref, data, status, updated_at
) = (
excluded.element_id, excluded.set_id, excluded.ref, excluded.data, excluded.status
now()
)
RETURNING atst_id"#;

    let row = sqlx::query(query)
        .bind(&set_element.element_id)
        .bind(&set_element.set_id)
        .bind(&set_element.r#ref)
        .bind(&set_element.data)
        .bind(&set_element.status)
        .fetch_one(&mut **tx)
        .await?;

    let element_id: String = row.try_get("element_id")?;

    return Ok(element_id);
}

pub async fn get_prfs_set_elements(
    pool: &Pool<Postgres>,
    set_id: &String,
    offset: i32,
    limit: i32,
) -> Result<Vec<PrfsSetElement>, DbInterfaceError> {
    let query = get_prfs_set_elements_query();

    let rows = sqlx::query(query)
        .bind(set_id)
        .bind(limit)
        .bind(offset)
        .fetch_all(pool)
        .await?;

    let atsts = rows
        .iter()
        .map(|row| {
            Ok(PrfsSetElement {
                element_id: row.try_get("element_id")?,
                data: row.try_get("data")?,
                r#ref: row.try_get("ref")?,
                status: row.try_get("status")?,
                element_idx: row.try_get("element_idx")?,
                set_id: row.try_get("set_id")?,
            })
        })
        .collect::<Result<Vec<PrfsSetElement>, DbInterfaceError>>()?;

    Ok(atsts)
}

#[allow(non_snake_case)]
pub async fn get_prfs_set_elements__tx(
    tx: &mut Transaction<'_, Postgres>,
    set_id: &String,
    offset: i32,
    limit: i32,
) -> Result<Vec<PrfsSetElement>, DbInterfaceError> {
    let query = get_prfs_set_elements_query();

    let rows = sqlx::query(query)
        .bind(set_id)
        .bind(limit)
        .bind(offset)
        .fetch_all(&mut **tx)
        .await?;

    let atsts = rows
        .iter()
        .map(|row| {
            Ok(PrfsSetElement {
                element_id: row.try_get("element_id")?,
                data: row.try_get("data")?,
                r#ref: row.try_get("ref")?,
                status: row.try_get("status")?,
                element_idx: row.try_get("element_idx")?,
                set_id: row.try_get("set_id")?,
            })
        })
        .collect::<Result<Vec<PrfsSetElement>, DbInterfaceError>>()?;

    Ok(atsts)
}

pub async fn get_prfs_set_element(
    pool: &Pool<Postgres>,
    set_id: &String,
    element_id: &String,
) -> Result<PrfsSetElement, DbInterfaceError> {
    let query = r#"
SELECT *
FROM prfs_set_elements
WHERE set_id=$1 
AND element_id=$2
"#;

    let row = sqlx::query(query)
        .bind(&set_id)
        .bind(&element_id)
        .fetch_one(pool)
        .await?;

    let atst = PrfsSetElement {
        element_id: row.try_get("element_id")?,
        data: row.try_get("data")?,
        r#ref: row.try_get("ref")?,
        status: row.try_get("status")?,
        element_idx: row.try_get("element_idx")?,
        set_id: row.try_get("set_id")?,
    };

    Ok(atst)
}

pub async fn delete_prfs_set_elements(
    tx: &mut Transaction<'_, Postgres>,
    set_id: &String,
) -> Result<u64, DbInterfaceError> {
    let query = r#"
DELETE FROM prfs_set_elements
WHERE set_id=$1
"#;

    let result = sqlx::query(query).bind(&set_id).execute(&mut **tx).await?;

    return Ok(result.rows_affected());
}
