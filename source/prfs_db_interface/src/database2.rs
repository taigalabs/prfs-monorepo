use std::time::Duration;

use crate::DbInterfaceError;
use colored::Colorize;
use log::LevelFilter;
use sqlx::{
    postgres::{PgConnectOptions, PgPoolOptions},
    ConnectOptions, Pool, Postgres,
};

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

        let connect_options = PgConnectOptions::from_url(&url.parse().unwrap())
            .unwrap()
            .log_slow_statements(LevelFilter::Warn, Duration::from_secs(5));

        let pool = PgPoolOptions::new()
            .max_connections(5)
            .connect_with(connect_options)
            .await
            .unwrap();

        println!("Postgres connected!");

        let d = Database2 { pool };

        return Ok(d);
    }
}
