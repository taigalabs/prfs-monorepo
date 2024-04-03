use prfs_db_driver::sqlx::{self, Pool, Postgres, Row, Transaction};
use prfs_entities::{PrfsAtstGroupMember, PrfsAtstTypeId};

use crate::DbInterfaceError;

pub async fn get_prfs_atst_group_member(
    pool: &Pool<Postgres>,
    atst_group_id: &String,
    member_id: &String,
    member_code: &String,
) -> Result<PrfsAtstGroupMember, DbInterfaceError> {
    let query = r#"
SELECT *
FROM prfs_atst_group_members
WHERE atst_group_id=$1
AND member_id=$2
AND member_code=$2
"#;

    let row = sqlx::query(query)
        .bind(atst_group_id)
        .bind(member_id)
        .bind(member_code)
        .fetch_one(pool)
        .await?;

    let m = PrfsAtstGroupMember {
        atst_group_id: row.get("atst_group_id"),
        member_id: row.get("member_id"),
        member_code: row.get("member_code"),
        code_type: row.get("code_type"),
        status: row.get("status"),
    };

    Ok(m)
}
