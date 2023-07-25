use rust_decimal::Decimal;

use crate::{
    database::Database,
    models::{PrfsAccount, PrfsSet},
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

    pub async fn insert_prfs_set(&self, prfs_set: &PrfsSet) -> Result<i64, DbInterfaceError> {
        let stmt = format!(
            "INSERT INTO {} (label, author, \"desc\") VALUES ('{}', '{}', '{}') \
ON CONFLICT DO NOTHING returning id",
            PrfsSet::table_name(),
            prfs_set.label,
            prfs_set.author,
            prfs_set.desc,
        );
        // println!("stmt: {}", stmt);

        let rows = match self.pg_client.query(&stmt, &[]).await {
            Ok(r) => r,
            Err(err) => {
                tracing::error!("Error executing stmt, err: {}, stmt: {}", err, stmt);

                return Err(err.into());
            }
        };

        let id: i64 = rows
            .get(0)
            .expect("One row should be returned")
            .try_get("id")
            .expect("id should be present");

        Ok(id)
    }
}
