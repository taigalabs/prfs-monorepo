use prfs_db_driver::sqlx::{self, Pool, Postgres, QueryBuilder, Row, Transaction};
use prfs_entities::{id_session::PrfsIdSession, PrfsIdApp};

use crate::DbInterfaceError;

pub async fn get_prfs_id_app(
    pool: &Pool<Postgres>,
    app_id: &String,
) -> Result<PrfsIdApp, DbInterfaceError> {
    let query = r#"
SELECT * 
FROM prfs_id_apps
WHERE app_id=$1
"#;

    let row = sqlx::query(query).bind(&app_id).fetch_one(pool).await?;

    let app = PrfsIdApp {
        app_id: row.try_get("app_id")?,
        label: row.try_get("label")?,
        img_url: row.try_get("img_url")?,
    };

    Ok(app)
}
