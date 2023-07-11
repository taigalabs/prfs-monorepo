use crate::DbInterfaceError;
use tokio_postgres::{Client as PGClient, NoTls};

pub struct Database {
    pub pg_client: PGClient,
}

impl Database {
    pub async fn connect(pg_endpoint: String, pg_pw: String) -> Result<Database, DbInterfaceError> {
        let pg_config = format!("host={} user=postgres password={}", pg_endpoint, pg_pw,);

        println!("Database try connecting... pg_config: {}", pg_config);

        let (pg_client, connection) = tokio_postgres::connect(&pg_config, NoTls).await?;

        println!("Postgres connected!");

        let d = Database { pg_client };

        tokio::spawn(async move {
            if let Err(e) = connection.await {
                println!("connection error: {}", e);
            }
        });

        return Ok(d);
    }
}
