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
LIMIT $1
OFFSET $2
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

pub async fn upsert_prfs_atst_group(
    tx: &mut Transaction<'_, Postgres>,
    atst_group: &PrfsAtstGroup,
) -> Result<String, DbInterfaceError> {
    let query = r#"
INSERT INTO prfs_atst_groups
(atst_group_id, label, "desc")
VALUES ($1, $2, $3)
ON CONFLICT (atst_group_id) DO UPDATE SET (
atst_group_id, label, "desc", updated_at
) = (
excluded.atst_group_id, excluded.label, excluded.desc, now()
)
RETURNING atst_group_id
"#;

    let row = sqlx::query(query)
        .bind(&atst_group.atst_group_id)
        .bind(&atst_group.label)
        .bind(&atst_group.desc)
        .fetch_one(&mut **tx)
        .await?;

    let circuit_id: String = row.try_get("atst_group_id")?;

    Ok(circuit_id)
}
