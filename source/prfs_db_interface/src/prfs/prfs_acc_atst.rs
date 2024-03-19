use prfs_db_driver::sqlx::{self, Pool, Postgres, Row, Transaction};
use prfs_entities::atst_entities::PrfsAccAtst;

use crate::DbInterfaceError;

pub async fn get_prfs_acc_atsts(
    pool: &Pool<Postgres>,
    offset: i32,
    limit: i32,
) -> Result<Vec<PrfsAccAtst>, DbInterfaceError> {
    let query = r#"
SELECT *
FROM prfs_acc_atsts
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
            Ok(PrfsAccAtst {
                acc_atst_id: row.try_get("acc_atst_id")?,
                atst_type: row.try_get("atst_type")?,
                dest: row.try_get("dest")?,
                account_id: row.try_get("account_id")?,
                cm: row.try_get("cm")?,
                username: row.try_get("username")?,
                avatar_url: row.try_get("avatar_url")?,
                document_url: row.try_get("document_url")?,
                status: row.try_get("status")?,
            })
        })
        .collect::<Result<Vec<PrfsAccAtst>, DbInterfaceError>>()?;

    Ok(atsts)
}

pub async fn get_prfs_acc_atst(
    pool: &Pool<Postgres>,
    acc_atst_id: &String,
) -> Result<PrfsAccAtst, DbInterfaceError> {
    let query = r#"
SELECT *
FROM prfs_acc_atsts
WHERE acc_atst_id=$1
"#;

    let row = sqlx::query(query)
        .bind(&acc_atst_id)
        .fetch_one(pool)
        .await?;

    let atst = PrfsAccAtst {
        acc_atst_id: row.try_get("acc_atst_id")?,
        atst_type: row.try_get("atst_type")?,
        dest: row.try_get("dest")?,
        account_id: row.try_get("account_id")?,
        cm: row.try_get("cm")?,
        username: row.try_get("username")?,
        avatar_url: row.try_get("avatar_url")?,
        document_url: row.try_get("document_url")?,
        status: row.try_get("status")?,
    };

    Ok(atst)
}

pub async fn insert_prfs_acc_atst(
    tx: &mut Transaction<'_, Postgres>,
    prfs_acc_atst: &PrfsAccAtst,
) -> Result<String, DbInterfaceError> {
    let query = r#"
INSERT INTO prfs_acc_atsts
(acc_atst_id, atst_type, dest, account_id, cm, username, avatar_url, document_url, status)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
ON CONFLICT (acc_atst_id) DO UPDATE SET (
atst_type, dest, account_id, cm, username, avatar_url, document_url, updated_at, status
) = (
excluded.atst_type, excluded.dest, excluded.account_id, excluded.cm, excluded.username, 
excluded.avatar_url, excluded.document_url, now(), excluded.status
)
RETURNING acc_atst_id"#;

    let row = sqlx::query(query)
        .bind(&prfs_acc_atst.acc_atst_id)
        .bind(&prfs_acc_atst.atst_type)
        .bind(&prfs_acc_atst.dest)
        .bind(&prfs_acc_atst.account_id)
        .bind(&prfs_acc_atst.cm)
        .bind(&prfs_acc_atst.username)
        .bind(&prfs_acc_atst.avatar_url)
        .bind(&prfs_acc_atst.document_url)
        .bind(&prfs_acc_atst.status)
        .fetch_one(&mut **tx)
        .await?;

    let acc_atst_id: String = row.try_get("acc_atst_id")?;

    return Ok(acc_atst_id);
}
