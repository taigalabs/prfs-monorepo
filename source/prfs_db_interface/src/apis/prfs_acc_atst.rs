use crate::DbInterfaceError;
use prfs_entities::entities::{PrfsAccAtst, PrfsIdentity};
use prfs_entities::sqlx::{self, Pool, Postgres, Row, Transaction};
use uuid::Uuid;

pub async fn get_prfs_acc_atsts(
    pool: &Pool<Postgres>,
    page_idx: i32,
    page_size: i32,
) -> Result<Vec<PrfsAccAtst>, DbInterfaceError> {
    let query = r#"
SELECT * 
FROM prfs_acc_atsts
"#;

    let rows = sqlx::query(query).fetch_all(pool).await?;

    let atsts = rows
        .iter()
        .map(|row| PrfsAccAtst {
            acc_atst_id: row.get("acc_atst_id"),
            atst_type: row.get("atst_type"),
            dest: row.get("dest"),
            account_id: row.get("account_id"),
            cm: row.get("cm"),
            username: row.get("username"),
            avatar_url: row.get("avatar_url"),
            document_url: row.get("document_url"),
        })
        .collect();

    Ok(atsts)
}

pub async fn insert_prfs_acc_atst(
    tx: &mut Transaction<'_, Postgres>,
    prfs_acc_atst: &PrfsAccAtst,
) -> Result<Uuid, DbInterfaceError> {
    let query = r#"
INSERT INTO prfs_acc_atsts
(acc_atst_id, atst_type, dest, account_id, cm, username, avatar_url, document_url)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8) returning acc_atst_id"#;

    let row = sqlx::query(query)
        .bind(&prfs_acc_atst.acc_atst_id)
        .bind(&prfs_acc_atst.atst_type)
        .bind(&prfs_acc_atst.dest)
        .bind(&prfs_acc_atst.account_id)
        .bind(&prfs_acc_atst.cm)
        .bind(&prfs_acc_atst.username)
        .bind(&prfs_acc_atst.avatar_url)
        .bind(&prfs_acc_atst.document_url)
        .fetch_one(&mut **tx)
        .await?;

    let acc_atst_id: Uuid = row.get("acc_atst_id");

    return Ok(acc_atst_id);
}
