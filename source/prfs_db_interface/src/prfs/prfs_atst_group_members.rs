use prfs_db_driver::sqlx::{self, Pool, Postgres, QueryBuilder, Row, Transaction};
use prfs_entities::{PrfsAtstGroupId, PrfsAtstGroupMember};

use crate::DbInterfaceError;

pub async fn get_prfs_atst_group_member(
    pool: &Pool<Postgres>,
    atst_group_id: &PrfsAtstGroupId,
    member_code: &String,
) -> Result<PrfsAtstGroupMember, DbInterfaceError> {
    let query = r#"
SELECT *
FROM prfs_atst_group_members
WHERE atst_group_id=$1
AND member_code=$2
"#;

    let row = sqlx::query(query)
        .bind(atst_group_id)
        .bind(member_code)
        .fetch_one(pool)
        .await?;

    let m = PrfsAtstGroupMember {
        atst_group_id: row.try_get("atst_group_id")?,
        member_id: row.try_get("member_id")?,
        member_code: row.try_get("member_code")?,
        code_type: row.try_get("code_type")?,
        status: row.try_get("status")?,
    };

    Ok(m)
}

pub async fn upsert_prfs_atst_group_members(
    tx: &mut Transaction<'_, Postgres>,
    atst_group_members: &Vec<PrfsAtstGroupMember>,
) -> Result<u64, DbInterfaceError> {
    let mut query_builder: QueryBuilder<Postgres> = QueryBuilder::new(
        r#"
INSERT INTO prfs_atst_group_members 
(atst_group_id, member_id, member_code, code_type, status)
"#,
    );

    query_builder.push_values(atst_group_members, |mut b, m| {
        b.push_bind(&m.atst_group_id)
            .push_bind(&m.member_id)
            .push_bind(&m.member_code)
            .push_bind(&m.code_type)
            .push_bind(&m.status);
    });

    query_builder.push(" ON CONFLICT (atst_group_id, member_code)");
    query_builder.push(
        r#" 
DO UPDATE SET (atst_group_id, member_id, member_code, status, updated_at) 
= (
excluded.atst_group_id, excluded.member_id, excluded.member_code, excluded.status, now()
)
"#,
    );

    let query = query_builder.build();
    // println!("query: {}", query.sql());
    let result = query.execute(&mut **tx).await?;

    Ok(result.rows_affected())
}
