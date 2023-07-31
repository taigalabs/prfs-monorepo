use crate::{database::Database, database2::Database2, models::PrfsAccount, DbInterfaceError};
use sqlx::Row;

impl Database2 {
    pub async fn get_prfs_accounts(
        &self,
        sig: &String,
    ) -> Result<Vec<PrfsAccount>, DbInterfaceError> {
        let query = "SELECT * from prfs_accounts where sig=$1";

        let rows = sqlx::query(query)
            .bind(&sig)
            .fetch_all(&self.pool)
            .await
            .unwrap();

        let prfs_accounts: Vec<PrfsAccount> = rows
            .iter()
            .map(|row| {
                let prfs_account = PrfsAccount {
                    sig: row.get("sig"),
                };

                prfs_account
            })
            .collect();

        Ok(prfs_accounts)
    }

    pub async fn insert_prfs_account(
        &self,
        prfs_account: &PrfsAccount,
    ) -> Result<String, DbInterfaceError> {
        let query = "INSERT INTO prfs_accounts \
            (sig) \
            VALUES ($1) returning sig";

        let row = sqlx::query(query)
            .bind(&prfs_account.sig)
            .fetch_one(&self.pool)
            .await
            .unwrap();

        let sig: String = row.get("sig");

        return Ok(sig);
    }
}
