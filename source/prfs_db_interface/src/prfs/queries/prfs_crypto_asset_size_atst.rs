use prfs_db_driver::sqlx::{self, Pool, Postgres, Row, Transaction};
use prfs_entities::{atst_entities::PrfsAttestation, PrfsAtstType};
use shy_entities::sqlx::QueryBuilder;

use crate::DbInterfaceError;

pub fn get_prfs_attestations_query<'a>() -> &'a str {
    let query = r#"
SELECT *
FROM prfs_attestations
WHERE atst_type=$1
ORDER BY created_at
LIMIT $2
OFFSET $3
"#;
    return query;
}
