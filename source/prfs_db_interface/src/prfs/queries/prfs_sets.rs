use chrono::{DateTime, Utc};
use prfs_db_driver::sqlx::{self, Pool, Postgres, Row, Transaction};
use prfs_entities::entities::PrfsSet;
use prfs_entities::prfs_api::PrfsSetIns1;

use crate::DbInterfaceError;

pub fn get_prfs_set_by_set_id_query<'a>() -> &'a str {
    let query = r#"
SELECT * 
FROM prfs_sets 
WHERE set_id=$1
"#;

    return query;
}

pub fn get_prfs_sets_by_topic_query<'a>() -> &'a str {
    let query = r#"
SELECT * 
FROM prfs_sets
WHERE topic=$1
"#;
    return query;
}
