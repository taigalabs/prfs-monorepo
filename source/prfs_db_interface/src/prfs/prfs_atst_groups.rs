use prfs_db_driver::sqlx::{self, Pool, Postgres, Row, Transaction};
use prfs_entities::{atst_entities::PrfsAttestation, PrfsAtstGroup, PrfsAtstTypeId};
use shy_entities::sqlx::QueryBuilder;

use super::queries::get_prfs_attestations_query;
use crate::DbInterfaceError;

const BIND_LIMIT: usize = 65535;

pub async fn get_prfs_atst_groups(
    pool: &Pool<Postgres>,
    offset: i32,
    limit: i32,
) -> Result<Vec<PrfsAtstGroup>, DbInterfaceError> {
    let query = r#"
SELECT *
FROM prfs_atst_groups
ORDER BY created_at
LIMIT $2
OFFSET $3
"#;

    let rows = sqlx::query(query)
        .bind(limit)
        .bind(offset)
        .fetch_all(pool)
        .await?;

    let atsts = rows
        .iter()
        .map(|row| PrfsAtstGroup {
            atst_group_id: row.get("atst_group_id"),
            label: row.get("label"),
            desc: row.get("desc"),
        })
        .collect();

    Ok(atsts)
}
