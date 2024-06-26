use prfs_db_driver::sqlx::{self, Pool, Postgres, QueryBuilder, Row, Transaction};
use prfs_entities::{PrfsAtstGroupId, PrfsAtstGroupMember};

use crate::DbInterfaceError;

use super::queries::get_prfs_atst_group_member_query;

pub async fn get_prfs_atst_group_member(
    pool: &Pool<Postgres>,
    atst_group_id: &PrfsAtstGroupId,
    member_code: &String,
) -> Result<PrfsAtstGroupMember, DbInterfaceError> {
    let query = get_prfs_atst_group_member_query();

    let row = sqlx::query(query)
        .bind(atst_group_id)
        .bind(member_code)
        .fetch_one(pool)
        .await?;

    let m = PrfsAtstGroupMember {
        atst_group_id: row.try_get("atst_group_id")?,
        label: row.try_get("label")?,
        member_code: row.try_get("member_code")?,
        code_type: row.try_get("code_type")?,
        status: row.try_get("status")?,
        meta: row.try_get("meta")?,
    };

    Ok(m)
}

#[allow(non_snake_case)]
pub async fn get_prfs_atst_group_member__tx(
    tx: &mut Transaction<'_, Postgres>,
    atst_group_id: &PrfsAtstGroupId,
    member_code: &String,
) -> Result<PrfsAtstGroupMember, DbInterfaceError> {
    let query = get_prfs_atst_group_member_query();

    let row = sqlx::query(query)
        .bind(atst_group_id)
        .bind(member_code)
        .fetch_one(&mut **tx)
        .await?;

    let m = PrfsAtstGroupMember {
        atst_group_id: row.try_get("atst_group_id")?,
        label: row.try_get("label")?,
        member_code: row.try_get("member_code")?,
        code_type: row.try_get("code_type")?,
        status: row.try_get("status")?,
        meta: row.try_get("meta")?,
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
(atst_group_id, label, member_code, code_type, status, meta)
"#,
    );

    query_builder.push_values(atst_group_members, |mut b, m| {
        b.push_bind(&m.atst_group_id)
            .push_bind(&m.label)
            .push_bind(&m.member_code)
            .push_bind(&m.code_type)
            .push_bind(&m.status)
            .push_bind(&m.meta);
    });

    query_builder.push(" ON CONFLICT (atst_group_id, member_code)");
    query_builder.push(
        r#" 
DO UPDATE SET (atst_group_id, label, member_code, status, meta, updated_at) 
= (
excluded.atst_group_id, excluded.label, excluded.member_code, excluded.status, excluded.meta,
now()
)
"#,
    );

    let query = query_builder.build();
    // println!("query: {}", query.sql());
    let result = query.execute(&mut **tx).await?;

    Ok(result.rows_affected())
}
