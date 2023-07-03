use super::{grow::grow_tree, SetType};
use crate::TreeMakerError;
use prfs_db_interface::{Account, Database, Node};
use rust_decimal::Decimal;

pub async fn make_leaves(db: &Database, set_type: &SetType) -> Result<(), TreeMakerError> {
    let accounts = db.get_accounts(&set_type.query).await?;

    let nodes: Vec<Node> = accounts
        .iter()
        .enumerate()
        .map(|(idx, acc)| {
            let pos_w = Decimal::from(idx);
            let pos_h = 0;
            let addr = format!("0x{}{}", "000000000000000000000000", &acc.addr[2..]);

            Node {
                pos_w,
                pos_h,
                val: addr,
                set_id: "1".to_string(),
            }
        })
        .collect();

    let rows_affected = db.insert_nodes("1".to_string(), nodes, true).await?;
    println!("make_leaves(): rows affected: {}", rows_affected);

    Ok(())
}
