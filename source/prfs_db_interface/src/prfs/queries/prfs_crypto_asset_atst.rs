pub fn get_prfs_attestations_by_atst_group_id_query<'a>() -> &'a str {
    let query = r#"
SELECT *
FROM prfs_attestations
WHERE atst_group_id=$1
ORDER BY created_at
LIMIT $2
OFFSET $3
"#;
    return query;
}
