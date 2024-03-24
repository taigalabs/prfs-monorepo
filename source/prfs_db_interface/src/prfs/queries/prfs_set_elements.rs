use prfs_db_driver::sqlx::{self, Pool, Postgres, QueryBuilder, Row, Transaction};
use prfs_entities::atst_entities::PrfsAttestation;
use prfs_entities::entities::{PrfsSetElement, PrfsSetElementData, PrfsSetElementDataType};
use prfs_entities::PrfsSetElementStatus;
use rust_decimal::prelude::FromPrimitive;
use rust_decimal::Decimal;

use crate::DbInterfaceError;

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
