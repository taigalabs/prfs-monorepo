pub fn get_prfs_set_by_set_id_query<'a>() -> &'a str {
    let query = r#"
SELECT * 
FROM prfs_sets 
WHERE set_id=$1
"#;

    return query;
}

pub fn get_prfs_sets_by_atst_group_id_query<'a>() -> &'a str {
    let query = r#"
SELECT * 
FROM prfs_sets
WHERE atst_group_id=$1
"#;
    return query;
}
