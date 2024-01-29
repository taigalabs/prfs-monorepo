use prfs_entities::{
    entities::PrfsProofType,
    prfs_api_entities::DatedPrfsIndex,
    sqlx::{self, Pool, Postgres, QueryBuilder, Row},
};

pub async fn get_least_recent_prfs_index(
    pool: &Pool<Postgres>,
    prfs_indices: &Vec<String>,
) -> Vec<DatedPrfsIndex> {
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

    return ret;
}
