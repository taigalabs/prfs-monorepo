use prfs_entities::{
    entities::PrfsProofType,
    prfs_api_entities::DatedPrfsIndex,
    sqlx::{self, Pool, Postgres, QueryBuilder, Row},
};

pub async fn get_least_recent_prfs_index(
    pool: &Pool<Postgres>,
    prfs_indices: &Vec<String>,
) -> Vec<DatedPrfsIndex> {
    let query = r#"
SELECT * 
FROM prfs_indices 
WHERE label in (
"#;

    let mut query_builder: QueryBuilder<Postgres> = QueryBuilder::new(query);
    let mut separated = query_builder.separated(", ");

    for idx in prfs_indices.iter() {
        separated.push_bind(idx);
    }
    separated.push_unseparated(") ");

    let query = query_builder.build();

    let rows = query.fetch_all(pool).await.unwrap();
    let ret = rows
        .iter()
        .map(|row| DatedPrfsIndex {
            label: row.get("label"),
            value: row.get("value"),
            serial_no: row.get("serial_no"),
            updated_at: row.get("updated_at"),
        })
        .collect();

    println!("rows: {:?}", ret);

    return ret;
}
