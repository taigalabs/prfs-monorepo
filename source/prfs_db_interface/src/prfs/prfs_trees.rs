use prfs_entities::entities::{PrfsSetType, PrfsTree, PrfsTreeNode};
use prfs_entities::sqlx::{self, Pool, Postgres, QueryBuilder, Row, Transaction};

use crate::DbInterfaceError;

pub async fn get_latest_prfs_tree_by_set_id(
    pool: &Pool<Postgres>,
    set_id: &String,
) -> Result<Option<PrfsTree>, DbInterfaceError> {
    let query = r#"
SELECT * 
FROM prfs_trees
WHERE set_id=$1
ORDER BY updated_at
DESC
LIMIT 1
"#;

    let row = sqlx::query(&query)
        .bind(&set_id)
        .fetch_optional(pool)
        .await
        .unwrap();

    if let Some(r) = row {
        let label = r.try_get("label").expect("label should exist");
        let tree_id = r.try_get("tree_id").expect("tree_id should exist");
        let set_id = r.try_get("set_id").expect("set_id should exist");

        let t = PrfsTree {
            label,
            tree_id,
            set_id,
        };

        Ok(Some(t))
    } else {
        Ok(None)
    }
}

pub async fn insert_prfs_tree(
    tx: &mut Transaction<'_, Postgres>,
    tree: &PrfsTree,
) -> Result<String, DbInterfaceError> {
    let query = r#"
INSERT INTO prfs_trees 
(tree_id, set_id, "label")
VALUES 
($1, $2, $3) 
RETURNING tree_id
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
