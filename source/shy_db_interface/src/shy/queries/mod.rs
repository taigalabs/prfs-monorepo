pub fn get_shy_topic_query<'a>() -> &'a str {
    let query = r#"
SELECT * 
FROM shy_topics
WHERE topic_id=$1
"#;

    return query;
}
