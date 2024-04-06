use prfs_db_driver::sqlx::{self, Pool, Postgres, Row, Transaction};
use prfs_entities::{atst_entities::PrfsAttestation, PrfsAtstGroup, PrfsAtstGroupId};

use crate::DbInterfaceError;

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
        .map(|row| {
            Ok(PrfsAtstGroup {
                atst_group_id: row.try_get("atst_group_id")?,
                label: row.try_get("label")?,
                desc: row.try_get("desc")?,
            })
        })
        .collect::<Result<Vec<PrfsAtstGroup>, DbInterfaceError>>()?;

    Ok(atsts)
}

pub async fn upsert_prfs_atst_group(
    tx: &mut Transaction<'_, Postgres>,
    atst_group: &PrfsAtstGroup,
) -> Result<PrfsAtstGroupId, DbInterfaceError> {
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

    let id: PrfsAtstGroupId = row.try_get("atst_group_id")?;

    Ok(id)
}
