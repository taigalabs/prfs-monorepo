use crate::{
    database::Database,
    models::PrfsSet,
    utils::{concat_cols, concat_values},
    DbInterfaceError,
};
use chrono::NaiveDate;

impl Database {
    pub async fn get_prfs_sets(
        &self,
        where_clause: &str,
    ) -> Result<Vec<PrfsSet>, DbInterfaceError> {
        let stmt = format!("SELECT * from {} {}", PrfsSet::__table_name(), where_clause);
        println!("stmt: {}", stmt);

        let rows = match self.pg_client.query(&stmt, &[]).await {
            Ok(r) => r,
            Err(err) => {
                tracing::error!("account retrieval failed, err: {}, stmt: {}", err, stmt);

                return Err(err.into());
            }
        };

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
                let merkle_root: String = r.try_get("merkle_root").expect("invalid merkle root");
                let element_type: String = r.try_get("element_type").expect("invalid element type");

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
        ]);

        let stmt = if update_on_conflict {
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

        println!("stmt: {}", stmt);

        let rows = match self.pg_client.query(&stmt, &[]).await {
            Ok(r) => r,
            Err(err) => {
                tracing::error!("Error executing stmt, err: {}, stmt: {}", err, stmt);

                return Err(err.into());
            }
        };

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
