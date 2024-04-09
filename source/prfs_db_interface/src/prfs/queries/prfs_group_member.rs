pub fn get_prfs_atst_group_member_query<'a>() -> &'a str {
    let query = r#"
SELECT *
FROM prfs_atst_group_members
WHERE atst_group_id=$1
AND member_code=$2
"#;

    return query;
}
