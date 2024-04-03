use prfs_db_driver::sqlx::{self, Pool, Postgres, QueryBuilder, Row, Transaction};
use prfs_entities::{atst_entities::PrfsAttestation, PrfsAtstTypeId};

use super::queries::get_prfs_attestations_query;
use crate::DbInterfaceError;

const BIND_LIMIT: usize = 65535;

pub async fn insert_prfs_attestation(
    tx: &mut Transaction<'_, Postgres>,
    prfs_attestation: &PrfsAttestation,
) -> Result<String, DbInterfaceError> {
    let query = r#"
INSERT INTO prfs_attestations
(atst_id, atst_type_id, label, cm, meta, value, status, atst_version)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
ON CONFLICT (atst_id) DO UPDATE SET (
atst_type_id, label, cm, meta, updated_at, value, status, atst_version
) = (
excluded.atst_type_id, excluded.label, excluded.cm, excluded.meta,
now(), excluded.value, excluded.status, excluded.atst_version
)
RETURNING atst_id"#;

    let row = sqlx::query(query)
        .bind(&prfs_attestation.atst_id)
        .bind(&prfs_attestation.atst_type_id)
        .bind(&prfs_attestation.label)
        .bind(&prfs_attestation.cm)
        .bind(&prfs_attestation.meta)
        .bind(&prfs_attestation.value)
        .bind(&prfs_attestation.status)
        .bind(&prfs_attestation.atst_version)
        .fetch_one(&mut **tx)
        .await?;

    let atst_id: String = row.get("atst_id");

    return Ok(atst_id);
}

pub async fn insert_prfs_attestations(
    tx: &mut Transaction<'_, Postgres>,
    prfs_attestations: &Vec<PrfsAttestation>,
) -> Result<u64, DbInterfaceError> {
    let mut query_builder: QueryBuilder<_> = QueryBuilder::new(
        r#"
INSERT INTO prfs_attestations
(atst_id, atst_type_id, label, cm, meta, value, status, atst_version) 
"#,
    );

    query_builder.push_values(
        prfs_attestations.iter().take(BIND_LIMIT / 4),
        |mut b, atst| {
            b.push_bind(&atst.atst_id)
                .push_bind(&atst.atst_type_id)
                .push_bind(&atst.label)
                .push_bind(&atst.cm)
                .push_bind(&atst.meta)
                .push_bind(&atst.value)
                .push_bind(&atst.status)
                .push_bind(&atst.atst_version);
        },
    );

    query_builder.push(
        r#"
ON CONFLICT (atst_id) DO UPDATE SET (
atst_type_id, label, cm, meta, updated_at, value, status, atst_version
) = (
excluded.atst_type_id, excluded.label, excluded.cm, excluded.meta,
now(), excluded.value, excluded.status, excluded.atst_version
)
    "#,
    );

    let query = query_builder.build();
    let rows = query.execute(&mut **tx).await?;

    return Ok(rows.rows_affected());
}

pub async fn get_prfs_attestations(
    pool: &Pool<Postgres>,
    atst_type_id: &PrfsAtstTypeId,
    offset: i32,
    limit: i32,
) -> Result<Vec<PrfsAttestation>, DbInterfaceError> {
    let query = get_prfs_attestations_query();

    let rows = sqlx::query(query)
        .bind(atst_type_id)
        .bind(limit)
        .bind(offset)
        .fetch_all(pool)
        .await?;

    let atsts = rows
        .iter()
        .map(|row| PrfsAttestation {
            atst_id: row.get("atst_id"),
            atst_type_id: row.get("atst_type_id"),
            cm: row.get("cm"),
            label: row.get("label"),
            value: row.get("value"),
            meta: row.get("meta"),
            status: row.get("status"),
            atst_version: row.get("atst_version"),
        })
        .collect();

    Ok(atsts)
}

#[allow(non_snake_case)]
pub async fn get_prfs_attestations__tx(
    tx: &mut Transaction<'_, Postgres>,
    atst_type_id: &PrfsAtstTypeId,
    offset: i32,
    limit: i32,
) -> Result<Vec<PrfsAttestation>, DbInterfaceError> {
    let query = get_prfs_attestations_query();

    let rows = sqlx::query(query)
        .bind(atst_type_id)
        .bind(limit)
        .bind(offset)
        .fetch_all(&mut **tx)
        .await?;

    let atsts = rows
        .iter()
        .map(|row| PrfsAttestation {
            atst_id: row.get("atst_id"),
            atst_type_id: row.get("atst_type_id"),
            cm: row.get("cm"),
            label: row.get("label"),
            value: row.get("value"),
            meta: row.get("meta"),
            status: row.get("status"),
            atst_version: row.get("atst_version"),
        })
        .collect();

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
        atst_id: row.get("atst_id"),
        atst_type_id: row.get("atst_type_id"),
        cm: row.get("cm"),
        label: row.get("label"),
        value: row.get("value"),
        meta: row.get("meta"),
        status: row.get("status"),
        atst_version: row.get("atst_version"),
    };

    Ok(atst)
}
