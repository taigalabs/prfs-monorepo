mod grow;
mod leaves;

use self::grow::grow_tree;
use crate::TreeMakerError;
use prfs_db_interface::{Account, Database, Node};
use rust_decimal::Decimal;

pub struct SetType {
    pub set_id: String,
    pub table_label: String,
    pub query: String,
}

lazy_static::lazy_static! {
    static ref WEI_200: SetType = SetType {
        set_id: "1".to_string(),
        table_label: "accounts".to_string(),
        query: "216800000000000000 <= wei and wei < 216900000000000000".to_string(),
    };
}

pub async fn run(db: Database) -> Result<(), TreeMakerError> {
    leaves::make_leaves(&db, &*WEI_200).await?;

    grow::grow_tree(&db, &*WEI_200).await?;

    Ok(())
}
