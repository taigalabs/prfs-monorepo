use rust_decimal::Decimal;

use crate::{
    database::Database,
    models::{PrfsAccount, PrfsSet},
    utils::{concat_cols, concat_values},
    DbInterfaceError,
};

impl Database {
    // pub async fn insert_prfs_set(
    //     &self,
    //     prfs_set: &PrfsSet,
    // ) -> Result<Vec<PrfsAccount>, DbInterfaceError> {
    //     let stmt = format!(
    //         "SELECT * from {} where {}",
    //         PrfsAccount::table_name(),
    //         where_clause
    //     );
    //     // println!("stmt: {}", stmt);

    //     let rows = match self.pg_client.query(&stmt, &[]).await {
    //         Ok(r) => r,
    //         Err(err) => {
    //             tracing::error!("account retrieval failed, err: {}, stmt: {}", err, stmt);

    //             return Err(err.into());
    //         }
    //     };
    //     println!("rows: {:?}", rows);

    //     let prfs_accounts: Vec<PrfsAccount> = rows
    //         .iter()
    //         .map(|r| {
    //             let sig: String = r.try_get("sig").expect("sig should be present");

    //             PrfsAccount { sig }
    //         })
    //         .collect();

    //     Ok(prfs_accounts)
    // }

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
        ]);

        let vals = concat_values(&[
            &prfs_set.set_id,
            &prfs_set.label,
            &prfs_set.author,
            &prfs_set.desc,
            &prfs_set.hash_algorithm,
            &prfs_set.cardinality.to_string(),
        ]);

        let stmt = if update_on_conflict {
            format!(
                "INSERT INTO {} ({}) VALUES ({}) \
                ON CONFLICT ({}) DO UPDATE SET cardinality = excluded.cardinality, \
                updated_at = now() returning set_id",
                PrfsSet::_table_name(),
                cols,
                vals,
                PrfsSet::set_id(),
            )
        } else {
            format!(
                "INSERT INTO {} ({}) VALUES ({}) \
                ON CONFLICT DO NOTHING returning set_id",
                PrfsSet::_table_name(),
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
