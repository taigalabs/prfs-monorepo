use crate::{
    database2::Database2,
    entities::PrfsSet,
    utils::{concat_cols, concat_values},
    DbInterfaceError,
};
use chrono::NaiveDate;
use sqlx::Row;

impl Database2 {
    pub async fn get_prfs_set(&self, set_id: &String) -> Result<PrfsSet, DbInterfaceError> {
        let query = format!("SELECT * from prfs_sets where set_id=$1");

        let row = sqlx::query(&query)
            .bind(&set_id)
            .fetch_one(&self.pool)
            .await
            .unwrap();

        let set_id: String = row.try_get("set_id").expect("invalid set_id");
        let label: String = row.try_get("label").expect("invalid label");
        let author: String = row.try_get("author").expect("invalid author");
        let desc: String = row.try_get("desc").expect("invalid desc");
        let hash_algorithm: String = row
            .try_get("hash_algorithm")
            .expect("invalid hash_algorithm");
        let cardinality: i64 = row.try_get("cardinality").expect("invalid cardinality");
        let created_at: NaiveDate = row.try_get("created_at").expect("invalid created_at");
        let merkle_root: String = row.try_get("merkle_root").expect("invalid merkle_root");
        let element_type: String = row.try_get("element_type").expect("invalid element_type");
        let elliptic_curve: String = row
            .try_get("elliptic_curve")
            .expect("invalid element_curve");
        let finite_field: String = row.try_get("finite_field").expect("invalid finite_field");

        let s = PrfsSet {
            set_id,
            label,
            author,
            desc,
            hash_algorithm,
            cardinality,
            created_at,
            merkle_root,
            element_type,
            elliptic_curve,
            finite_field,
        };

        Ok(s)
    }

    pub async fn get_prfs_sets(&self) -> Result<Vec<PrfsSet>, DbInterfaceError> {
        let query = format!("SELECT * from prfs_sets");

        // let query = format!("SELECT st.*, ptn.val from prfs_sets st join prfs_tree_nodes ptn on ptn.set_id=st.set_id where ptn.pos_h=31");

        let rows = sqlx::query(&query).fetch_all(&self.pool).await.unwrap();

        let prfs_sets: Vec<PrfsSet> = rows
            .iter()
            .map(|r| {
                let set_id: String = r.try_get("set_id").expect("invalid set_id");
                let label: String = r.try_get("label").expect("invalid label");
                let author: String = r.try_get("author").expect("invalid author");
                let desc: String = r.try_get("desc").expect("invalid desc");
                let hash_algorithm: String =
                    r.try_get("hash_algorithm").expect("invalid hash_algorithm");
                let cardinality: i64 = r.try_get("cardinality").expect("invalid cardinality");
                let created_at: NaiveDate = r.try_get("created_at").expect("invalid created_at");
                let merkle_root: String = r.try_get("merkle_root").expect("invalid merkle_root");
                let element_type: String = r.try_get("element_type").expect("invalid element_type");
                let elliptic_curve: String =
                    r.try_get("elliptic_curve").expect("invalid element_curve");
                let finite_field: String = r.try_get("finite_field").expect("invalid finite_field");

                PrfsSet {
                    set_id,
                    label,
                    author,
                    desc,
                    hash_algorithm,
                    cardinality,
                    created_at,
                    merkle_root,
                    element_type,
                    elliptic_curve,
                    finite_field,
                }
            })
            .collect();

        Ok(prfs_sets)
    }

    pub async fn insert_prfs_set(
        &self,
        prfs_set: &PrfsSet,
        update_on_conflict: bool,
    ) -> Result<Vec<String>, DbInterfaceError> {
        let cols = concat_cols(&[
            PrfsSet::set_id(),
            PrfsSet::label(),
            PrfsSet::author(),
            PrfsSet::desc(),
            PrfsSet::hash_algorithm(),
            PrfsSet::cardinality(),
            PrfsSet::merkle_root(),
            PrfsSet::element_type(),
            PrfsSet::elliptic_curve(),
            PrfsSet::finite_field(),
        ]);

        let vals = concat_values(&[
            &prfs_set.set_id,
            &prfs_set.label,
            &prfs_set.author,
            &prfs_set.desc,
            &prfs_set.hash_algorithm,
            &prfs_set.cardinality.to_string(),
            &prfs_set.merkle_root,
            &prfs_set.element_type,
            &prfs_set.elliptic_curve,
            &prfs_set.finite_field,
        ]);

        let query = if update_on_conflict {
            format!(
                "INSERT INTO {} ({}) VALUES ({}) \
                ON CONFLICT ({}) DO UPDATE SET cardinality = excluded.cardinality, \
                merkle_root = excluded.merkle_root, updated_at = now() returning set_id",
                PrfsSet::__table_name(),
                cols,
                vals,
                PrfsSet::set_id(),
            )
        } else {
            format!(
                "INSERT INTO {} ({}) VALUES ({}) \
                ON CONFLICT DO NOTHING returning set_id",
                PrfsSet::__table_name(),
                cols,
                vals,
            )
        };

        // println!("stmt: {}", stmt);

        // let rows = match self.pg_client.query(&stmt, &[]).await {
        //     Ok(r) => r,
        //     Err(err) => {
        //         tracing::error!("Error executing stmt, err: {}, stmt: {}", err, stmt);

        //         return Err(err.into());
        //     }
        // };

        let rows = sqlx::query(&query).fetch_all(&self.pool).await.unwrap();

        let set_ids: Vec<String> = rows
            .iter()
            .map(|r| {
                let set_id: String = r.try_get("set_id").unwrap();
                set_id
            })
            .collect();

        Ok(set_ids)
    }
}
