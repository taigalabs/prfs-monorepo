use crate::{
    database::Database,
    models::{PrfsProofType, PrfsSet},
    utils::{concat_cols, concat_values},
    DbInterfaceError,
};
use chrono::NaiveDate;

impl Database {
    pub fn get_prfs_proof_types(&self, where_clause: &str) {}

    pub fn insert_prfs_proof_types(
        &self,
        proof_types: &Vec<PrfsProofType>,
        update_on_conflict: bool,
    ) {
        let cols = concat_cols(&[
            PrfsProofType::set_id(),
            PrfsProofType::label(),
            PrfsProofType::author(),
            PrfsProofType::desc(),
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
