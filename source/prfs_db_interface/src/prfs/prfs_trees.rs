use prfs_entities::entities::{PrfsSetType, PrfsTree, PrfsTreeNode};
use prfs_entities::sqlx::{self, Pool, Postgres, QueryBuilder, Row, Transaction};

use crate::DbInterfaceError;

// pub async fn get_prfs_tree_root(
//     pool: &Pool<Postgres>,
//     set_id: &String,
// ) -> Result<PrfsTreeNode, DbInterfaceError> {
//     let query = format!("SELECT * from prfs_tree_nodes where set_id=$1 and pos_h=31 and pos_w=0",);
//     // println!("query: {}", query);

//     let row = sqlx::query(&query)
//         .bind(&set_id)
//         .fetch_one(pool)
//         .await
//         .unwrap();

//     let pos_w = row.try_get("pos_w").expect("pos_w should exist");
//     let pos_h = row.try_get("pos_h").expect("pos_h should exist");
//     let val = row.try_get("val").expect("val should exist");
//     let set_id = row.try_get("set_id").expect("set_id should exist");
//     let meta = row.get("meta");

//     let n = PrfsTreeNode {
//         pos_w,
//         pos_h,
//         val,
//         set_id,
//         meta,
//     };

//     Ok(n)
// }

pub async fn insert_prfs_tree(
    tx: &mut Transaction<'_, Postgres>,
    tree: &PrfsTree,
) -> Result<String, DbInterfaceError> {
    let query = r#"
INSERT INTO prfs_trees 
(tree_id, set_id, "label")
VALUES 
($1, $2, $3) 
RETURNING tree_id"
"#;

    let row = sqlx::query(&query)
        .bind(&tree.tree_id)
        .bind(&tree.set_id)
        .bind(&tree.label)
        .fetch_one(&mut **tx)
        .await
        .expect(&format!("insertion failed, set_id: {}", tree.tree_id));

    let tree_id: String = row.get("tree_id");

    return Ok(tree_id);
}
