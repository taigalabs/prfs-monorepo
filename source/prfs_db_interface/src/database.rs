use super::models::Account;
use crate::{
    models::{Node, ProofType},
    DbInterfaceError,
};
use rust_decimal::Decimal;
use std::collections::BTreeMap;
use tokio_postgres::{Client as PGClient, NoTls, Row};

pub struct Database {
    pub pg_client: PGClient,
}

impl Database {
    pub async fn connect() -> Result<Database, DbInterfaceError> {
        let postgres_endpoint = std::env::var("POSTGRES_ENDPOINT")?;
        let postgres_pw = std::env::var("POSTGRES_PW")?;

        let pg_config = format!(
            "host={} user=postgres password={}",
            postgres_endpoint, postgres_pw
        );

        println!("Postgres pg_config: {}", pg_config);

        let (pg_client, connection) = tokio_postgres::connect(&pg_config, NoTls).await?;

        let d = Database { pg_client };

        tokio::spawn(async move {
            if let Err(e) = connection.await {
                println!("connection error: {}", e);
            }
        });

        return Ok(d);
    }
}
