use crate::{database2::Database2, DbInterfaceError};
use prfs_entities::apis_entities::NodePos;
use prfs_entities::entities::PrfsTreeNode;
use prfs_entities::sqlx::{self, Pool, Postgres, Row, Transaction};
use rust_decimal::Decimal;
use uuid::Uuid;

pub async fn get_prfs_tree_nodes_by_pos(
    pool: &Pool<Postgres>,
    set_id: &Uuid,
    // where_clause: &str,
    pos: &Vec<NodePos>,
) -> Result<Vec<PrfsTreeNode>, DbInterfaceError> {
    let whre: Vec<String> = pos
        .iter()
        .map(|mp| format!("(pos_w = {} and pos_h = {})", mp.pos_w, mp.pos_h))
        .collect();

    let whre = whre.join(" OR ");

    let where_clause = format!(
        "where set_id = '{}' AND ({}) ORDER BY pos_h",
        set_id.to_string(),
        whre,
    );

    println!("where_clause, {}", where_clause);
    let query = format!("SELECT * from prfs_tree_nodes nodes {}", where_clause);
    println!("query: {}", query);

    let rows = sqlx::query(&query).fetch_all(pool).await.unwrap();

    let nodes: Vec<PrfsTreeNode> = rows
        .iter()
        .map(|n| {
            let pos_w = n.try_get("pos_w").expect("pos_w should exist");
            let pos_h = n.try_get("pos_h").expect("pos_h should exist");
            let val = n.try_get("val").expect("val should exist");
            let set_id = n.try_get("set_id").expect("set_id should exist");
            let meta = n.get("meta");

            PrfsTreeNode {
                pos_w,
                pos_h,
                meta,
                val,
                set_id,
            }
        })
        .collect();

    Ok(nodes)
}

pub async fn get_prfs_tree_leaf_indices(
    pool: &Pool<Postgres>,
    set_id: &Uuid,
    leaf_vals: &Vec<String>,
) -> Result<Vec<PrfsTreeNode>, DbInterfaceError> {
    let mut leaf_clause = vec![];

    for val in leaf_vals {
        let l = format!("val = '{}'", val.to_lowercase());
        leaf_clause.push(l);
    }

    let where_clause = format!(
        "where set_id = '{}' AND pos_h = 0 AND {}",
        set_id.to_string(),
        leaf_clause.join(" or ")
    );

    let query = format!("SELECT * from prfs_tree_nodes nodes {}", where_clause);
    println!("query: {}", query);

    let rows = sqlx::query(&query).fetch_all(pool).await.unwrap();

    let nodes: Vec<PrfsTreeNode> = rows
        .iter()
        .map(|n| {
            let pos_w = n.try_get("pos_w").expect("pos_w should exist");
            let pos_h = n.try_get("pos_h").expect("pos_h should exist");
            let val = n.try_get("val").expect("val should exist");
            let set_id = n.try_get("set_id").expect("set_id should exist");
            let meta = n.get("meta");

            PrfsTreeNode {
                pos_w,
                pos_h,
                meta,
                val,
                set_id,
            }
        })
        .collect();

    Ok(nodes)
}

pub async fn get_prfs_tree_leaf_nodes_by_set_id(
    pool: &Pool<Postgres>,
    set_id: &Uuid,
    page_idx: i32,
    page_size: i32,
) -> Result<Vec<PrfsTreeNode>, DbInterfaceError> {
    let query = r#"
SELECT * from prfs_tree_nodes nodes where set_id=$1 and pos_h=0 
ORDER BY pos_w ASC
OFFSET $2
LIMIT $3
"#;

    println!("query: {}", query);
    let offset = page_idx * page_size;

    let rows = sqlx::query(&query)
        .bind(&set_id)
        .bind(&offset)
        .bind(&page_size)
        .fetch_all(pool)
        .await
        .unwrap();

    let nodes: Vec<PrfsTreeNode> = rows
        .iter()
        .map(|n| {
            let pos_w = n.try_get("pos_w").expect("pos_w should exist");
            let pos_h = n.try_get("pos_h").expect("pos_h should exist");
            let val = n.try_get("val").expect("val should exist");
            let set_id = n.try_get("set_id").expect("set_id should exist");
            let meta = n.get("meta");

            PrfsTreeNode {
                pos_w,
                pos_h,
                val,
                meta,
                set_id,
            }
        })
        .collect();

    Ok(nodes)
}

pub async fn get_prfs_tree_root(
    pool: &Pool<Postgres>,
    set_id: &Uuid,
) -> Result<PrfsTreeNode, DbInterfaceError> {
    let query = format!("SELECT * from prfs_tree_nodes where set_id=$1 and pos_h=31 and pos_w=0",);
    // println!("query: {}", query);

    let row = sqlx::query(&query)
        .bind(&set_id)
        .fetch_one(pool)
        .await
        .unwrap();

    let pos_w = row.try_get("pos_w").expect("pos_w should exist");
    let pos_h = row.try_get("pos_h").expect("pos_h should exist");
    let val = row.try_get("val").expect("val should exist");
    let set_id = row.try_get("set_id").expect("set_id should exist");
    let meta = row.get("meta");

    let n = PrfsTreeNode {
        pos_w,
        pos_h,
        val,
        set_id,
        meta,
    };

    Ok(n)
}

pub async fn insert_prfs_tree_nodes(
    tx: &mut Transaction<'_, Postgres>,
    nodes: &[PrfsTreeNode],
    update_on_conflict: bool,
) -> Result<u64, DbInterfaceError> {
    let mut values = Vec::with_capacity(nodes.len());

    for n in nodes {
        let val = format!("({}, {}, '{}', '{}')", n.pos_w, n.pos_h, n.val, n.set_id,);
        values.push(val);
    }

    let query = if update_on_conflict {
        format!(
            "INSERT INTO prfs_tree_nodes (pos_w, pos_h, val, set_id) VALUES {} ON CONFLICT \
                    (pos_w, pos_h, set_id) {}",
            values.join(","),
            "DO UPDATE SET val = excluded.val, updated_at = now()",
        )
    } else {
        format!(
            "INSERT INTO prfs_tree_nodes (pos_w, pos_h, val, set_id) VALUES {} ON CONFLICT DO NOTHING",
            values.join(","),
        )
    };

    let result = sqlx::query(&query).execute(&mut **tx).await.unwrap();

    Ok(result.rows_affected())
}

pub async fn get_largest_pos_w_tree_leaf_node(
    pool: &Pool<Postgres>,
    set_id: &Uuid,
) -> Result<Option<Decimal>, DbInterfaceError> {
    let query = r#"
SELECT * FROM prfs_tree_nodes
where set_id=$1 and pos_h=0
ORDER BY pos_w desc
"#;
    // println!("query: {}", query);

    let row = sqlx::query(&query)
        .bind(&set_id)
        .fetch_optional(pool)
        .await
        .unwrap();

    if let Some(r) = row {
        let pos_w: Decimal = r.get("pos_w");

        Ok(Some(pos_w))
    } else {
        return Ok(None);
    }
}

pub async fn insert_prfs_tree_node(
    tx: &mut Transaction<'_, Postgres>,
    node: &PrfsTreeNode,
) -> Result<Decimal, DbInterfaceError> {
    let query = r#"
INSERT INTO prfs_tree_nodes
(set_id, pos_w, pos_h, val, "meta")
VALUES ($1, $2, $3, $4, $5) returning pos_w"#;

    let row = sqlx::query(query)
        .bind(&node.set_id)
        .bind(&node.pos_w)
        .bind(&node.pos_h)
        .bind(&node.val)
        .bind(&node.meta)
        .fetch_one(&mut **tx)
        .await
        .unwrap();

    let pos_w: Decimal = row.get("pos_w");

    return Ok(pos_w);
}

pub async fn update_prfs_tree_node(
    tx: &mut Transaction<'_, Postgres>,
    node: &PrfsTreeNode,
) -> Result<Decimal, DbInterfaceError> {
    let query = r#"
INSERT INTO prfs_tree_nodes
(set_id, pos_w, pos_h, val, "meta")
VALUES ($1, $2, $3, $4, $5)
ON CONFLICT (pos_w, pos_h, set_id) DO UPDATE SET val=excluded.val, meta=excluded.meta,
updated_at = now()
returning pos_w
"#;

    let row = sqlx::query(query)
        .bind(&node.set_id)
        .bind(&node.pos_w)
        .bind(&node.pos_h)
        .bind(&node.val)
        .bind(&node.meta)
        .fetch_one(&mut **tx)
        .await
        .unwrap();

    let pos_w: Decimal = row.get("pos_w");

    return Ok(pos_w);
}
