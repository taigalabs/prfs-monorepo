use prfs_entities::entities::{
    PrfsCryptoAssetSizeAtst, PrfsSetElement, PrfsSetElementData, PrfsSetElementDataType,
};
use prfs_entities::sqlx::{self, Pool, Postgres, QueryBuilder, Row, Transaction};
use rust_decimal::prelude::FromPrimitive;
use rust_decimal::Decimal;

use crate::DbInterfaceError;

pub async fn insert_asset_atsts_as_prfs_set_elements(
    tx: &mut Transaction<'_, Postgres>,
    atsts: Vec<PrfsCryptoAssetSizeAtst>,
    set_id: &String,
) -> Result<u64, DbInterfaceError> {
    let mut query_builder: QueryBuilder<Postgres> = QueryBuilder::new(
        r#"
INSERT INTO prfs_set_elements 
(label, data, ref, set_id, element_idx, status) "#,
    );

    query_builder.push_values(atsts.iter().enumerate(), |mut b, (idx, atst)| {
        let total_val = atst.total_value_usd.floor();
        let data = sqlx::types::Json::from(vec![
            PrfsSetElementData {
                label: "cm".to_string(),
                r#type: PrfsSetElementDataType::WalletCm,
                val: atst.cm.to_string(),
            },
            PrfsSetElementData {
                label: "total_val".to_string(),
                r#type: PrfsSetElementDataType::Int,
                val: total_val.to_string(),
            },
        ]);

        b.push_bind(atst.wallet_addr.to_string())
            .push_bind(data)
            .push_bind("crypto_asset_size_atsts")
            .push_bind(set_id)
            .push_bind(Decimal::from_u64(idx as u64))
            .push_bind("NotRegistered");
    });

    query_builder.push(
        r#"
ON CONFLICT (label, set_id) DO UPDATE SET (
label, set_id, ref, data, status, updated_at
) = (
excluded.label, excluded.set_id, excluded.ref, excluded.data, excluded.status,
now()
)
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
(label, set_id, ref, data, status)
VALUES ($1, $2, $3, $4)
ON CONFLICT (label, set_id) DO UPDATE SET (
label, set_id, ref, data, status, updated_at
) = (
excluded.label, excluded.set_id, excluded.ref, excluded.data, excluded.status
now()
)
RETURNING atst_id"#;

    let row = sqlx::query(query)
        .bind(&set_element.label)
        .bind(&set_element.set_id)
        .bind(&set_element.r#ref)
        .bind(&set_element.data)
        .bind(&set_element.status)
        .fetch_one(&mut **tx)
        .await?;

    let label: String = row.get("label");

    return Ok(label);
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
            label: row.get("label"),
            data: row.get("data"),
            r#ref: row.get("ref"),
            status: row.get("status"),
            element_idx: row.get("element_idx"),
            set_id: row.get("set_id"),
        })
        .collect();

    Ok(atsts)
}

pub async fn get_prfs_set_element(
    pool: &Pool<Postgres>,
    set_id: &String,
    label: &String,
) -> Result<PrfsSetElement, DbInterfaceError> {
    let query = r#"
SELECT *
FROM prfs_set_elements
WHERE set_id=$1 AND label=$2
"#;

    let row = sqlx::query(query)
        .bind(&set_id)
        .bind(&label)
        .fetch_one(pool)
        .await?;

    let atst = PrfsSetElement {
        label: row.get("label"),
        data: row.get("data"),
        r#ref: row.get("ref"),
        status: row.get("status"),
        element_idx: row.get("element_idx"),
        set_id: row.get("set_id"),
    };

    Ok(atst)
}
