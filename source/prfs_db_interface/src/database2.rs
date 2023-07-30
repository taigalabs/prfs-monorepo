use crate::DbInterfaceError;
use colored::Colorize;
use sqlx::{postgres::PgPoolOptions, Pool, Postgres};

pub struct Database2 {
    pub pool: Pool<Postgres>,
}

impl Database2 {
    pub async fn connect(
        pg_endpoint: &String,
        pg_username: &String,
        pg_pw: &String,
    ) -> Result<Database2, DbInterfaceError> {
        let url = format!(
            "postgres://{}:{}@{}/postgres",
            pg_username, pg_pw, pg_endpoint,
        );

        println!("url: {}", url);

        let pool = PgPoolOptions::new()
            .max_connections(5)
            .connect(&url)
            .await
            .unwrap();

        println!("Postgres connected!");

        let d = Database2 { pool };

        // tokio::spawn(async move {
        //     if let Err(e) = connection.await {
        //         println!("connection error: {}", e);
        //     }
        // });

        // return Ok(d);
        return Ok(d);
    }
}
