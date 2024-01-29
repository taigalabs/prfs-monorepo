use prfs_entities::sqlx::{self, Pool, Postgres, QueryBuilder, Row, Transaction};
use prfs_entities::{entities::PrfsProofType, prfs_api_entities::DatedPrfsIndex};

use crate::DbInterfaceError;

pub async fn get_least_recent_prfs_index(
    pool: &Pool<Postgres>,
    prfs_indices: &Vec<String>,
) -> Result<Vec<DatedPrfsIndex>, DbInterfaceError> {
    let mut query_builder: QueryBuilder<Postgres> = QueryBuilder::new(
        r#"
SELECT prfs_indices.*, label as label2
FROM (values
"#,
    );
    let mut separated = query_builder.separated(", ");

    for idx in prfs_indices.iter() {
        separated.push(format!("('{}')", idx));
    }
    separated.push_unseparated(") ");
    separated.push_unseparated(
        r#"
v(label) LEFT JOIN
prfs_indices
USING (label)
ORDER BY updated_at DESC
"#,
    );

    // let sql = query_builder.sql();
    // println!("sql: {:?}", sql);

    let query = query_builder.build();
    let rows = query.fetch_all(pool).await.unwrap();
    let ret = rows
        .iter()
        .map(|row| DatedPrfsIndex {
            label: row.get("label"),
            value: row.get("value"),
            serial_no: row.get("serial_no"),
            updated_at: row.get("updated_at"),
            label2: row.get("label2"),
        })
        .collect();

    println!("rows: {:?}", ret);

    return Ok(ret);
}

pub async fn upsert_prfs_index(
    tx: &mut Transaction<'_, Postgres>,
    label: &String,
    value: &String,
    serial_no: &String,
) -> Result<String, DbInterfaceError> {
    let query = r#"
INSERT INTO prfs_indices
(label, value, serial_no)
VALUES ($1, $2, $3)
ON CONFLICT (label) DO UPDATE SET (
label, value, updated_at
) = (
excluded.label, excluded.value, now()
)
RETURNING atst_id"#;

    let row = sqlx::query(query)
        .bind(&label)
        .bind(&value)
        .bind(&serial_no)
        .fetch_one(&mut **tx)
        .await?;

    let label: String = row.get("label");

    return Ok(label);
}
