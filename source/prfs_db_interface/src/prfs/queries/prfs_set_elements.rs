pub fn get_prfs_set_elements_query<'a>() -> &'a str {
    let query = r#"
SELECT *
FROM prfs_set_elements
WHERE set_id=$1
ORDER BY element_idx ASC
LIMIT $2
OFFSET $3
"#;

    return query;
}
