use prfs_db_driver::sqlx::{self, Pool, Postgres, QueryBuilder, Row, Transaction};
use prfs_entities::{atst_entities::PrfsAttestation, PrfsAtstGroupId};

use super::queries::get_prfs_attestations_by_atst_group_id_query;
use crate::DbInterfaceError;

const BIND_LIMIT: usize = 65535;

pub async fn insert_prfs_attestation(
    tx: &mut Transaction<'_, Postgres>,
    prfs_attestation: &PrfsAttestation,
) -> Result<String, DbInterfaceError> {
    let query = r#"
INSERT INTO prfs_attestations
(atst_id, label, cm, meta, status, atst_version, atst_group_id, value, member_label)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
ON CONFLICT (atst_id) DO UPDATE SET (
label, cm, meta, updated_at, status, atst_version, atst_group_id, value, member_label
) = (
excluded.label, excluded.cm, excluded.meta,
now(), excluded.status, excluded.atst_version, excluded.atst_group_id,
excluded.value, excluded.member_label
)
RETURNING atst_id"#;

    let row = sqlx::query(query)
        .bind(&prfs_attestation.atst_id)
        .bind(&prfs_attestation.label)
        .bind(&prfs_attestation.cm)
        .bind(&prfs_attestation.meta)
        .bind(&prfs_attestation.status)
        .bind(&prfs_attestation.atst_version)
        .bind(&prfs_attestation.atst_group_id)
        .bind(&prfs_attestation.value)
        .bind(&prfs_attestation.member_label)
        .fetch_one(&mut **tx)
        .await?;

    let atst_id: String = row.try_get("atst_id")?;

    return Ok(atst_id);
}

pub async fn upsert_prfs_attestations(
    tx: &mut Transaction<'_, Postgres>,
    prfs_attestations: &Vec<PrfsAttestation>,
) -> Result<u64, DbInterfaceError> {
    let mut query_builder: QueryBuilder<_> = QueryBuilder::new(
        r#"
INSERT INTO prfs_attestations
(atst_id, label, cm, meta, status, atst_version, atst_group_id, value, member_label)
"#,
    );

    query_builder.push_values(
        prfs_attestations.iter().take(BIND_LIMIT / 4),
        |mut b, atst| {
            b.push_bind(&atst.atst_id)
                .push_bind(&atst.label)
                .push_bind(&atst.cm)
                .push_bind(&atst.meta)
                .push_bind(&atst.status)
                .push_bind(&atst.atst_version)
                .push_bind(&atst.atst_group_id)
                .push_bind(&atst.value)
                .push_bind(&atst.member_label);
        },
    );

    query_builder.push(
        r#"
ON CONFLICT (atst_id) DO UPDATE SET (
label, cm, meta, updated_at, status, atst_version, atst_group_id, value
) = (
excluded.label, excluded.cm, excluded.meta,
now(), excluded.status, excluded.atst_version, excluded.atst_group_id, excluded.value
)
    "#,
    );

    let query = query_builder.build();
    let rows = query.execute(&mut **tx).await?;

    return Ok(rows.rows_affected());
}

pub async fn get_prfs_attestations_by_atst_group_id(
    pool: &Pool<Postgres>,
    atst_group_id: &PrfsAtstGroupId,
    offset: i32,
    limit: i32,
) -> Result<Vec<PrfsAttestation>, DbInterfaceError> {
    let query = r#"
SELECT *
FROM prfs_attestations
WHERE atst_group_id=$1
ORDER BY created_at
LIMIT $2
OFFSET $3
"#;

    let rows = sqlx::query(query)
        .bind(atst_group_id)
        .bind(limit + 1)
        .bind(offset)
        .fetch_all(pool)
        .await?;

    let atsts = rows
        .iter()
        .map(|row| {
            Ok(PrfsAttestation {
                atst_id: row.try_get("atst_id")?,
                cm: row.try_get("cm")?,
                label: row.try_get("label")?,
                meta: row.try_get("meta")?,
                status: row.try_get("status")?,
                atst_version: row.try_get("atst_version")?,
                atst_group_id: row.try_get("atst_group_id")?,
                value: row.try_get("value")?,
                member_label: row.try_get("member_label")?,
            })
        })
        .collect::<Result<Vec<PrfsAttestation>, DbInterfaceError>>()?;

    Ok(atsts)
}

#[allow(non_snake_case)]
pub async fn get_prfs_attestations_by_atst_group_id__tx(
    tx: &mut Transaction<'_, Postgres>,
    atst_group_id: &PrfsAtstGroupId,
    offset: i32,
    limit: i32,
) -> Result<Vec<PrfsAttestation>, DbInterfaceError> {
    let query = get_prfs_attestations_by_atst_group_id_query();

    let rows = sqlx::query(query)
        .bind(atst_group_id)
        .bind(limit)
        .bind(offset)
        .fetch_all(&mut **tx)
        .await?;

    let atsts = rows
        .iter()
        .map(|row| {
            Ok(PrfsAttestation {
                atst_id: row.try_get("atst_id")?,
                cm: row.try_get("cm")?,
                label: row.try_get("label")?,
                value: row.try_get("value")?,
                meta: row.try_get("meta")?,
                status: row.try_get("status")?,
                atst_version: row.try_get("atst_version")?,
                atst_group_id: row.try_get("atst_group_id")?,
                member_label: row.try_get("member_label")?,
            })
        })
        .collect::<Result<Vec<PrfsAttestation>, DbInterfaceError>>()?;

    Ok(atsts)
}

pub async fn get_prfs_attestation(
    pool: &Pool<Postgres>,
    atst_id: &String,
) -> Result<PrfsAttestation, DbInterfaceError> {
    let query = r#"
SELECT *
FROM prfs_attestations
WHERE atst_id=$1
"#;

    let row = sqlx::query(query).bind(&atst_id).fetch_one(pool).await?;

    let atst = PrfsAttestation {
        atst_id: row.try_get("atst_id")?,
        cm: row.try_get("cm")?,
        label: row.try_get("label")?,
        meta: row.try_get("meta")?,
        status: row.try_get("status")?,
        atst_version: row.try_get("atst_version")?,
        atst_group_id: row.try_get("atst_group_id")?,
        value: row.try_get("value")?,
        member_label: row.try_get("member_label")?,
    };

    Ok(atst)
}
