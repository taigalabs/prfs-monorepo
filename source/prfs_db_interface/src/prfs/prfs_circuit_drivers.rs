use prfs_db_driver::sqlx::{self, Pool, Postgres, QueryBuilder, Row, Transaction};
use prfs_entities::entities::PrfsCircuitDriver;

use crate::DbInterfaceError;

pub async fn get_prfs_circuit_driver_by_circuit_driver_id(
    pool: &Pool<Postgres>,
    circuit_driver_id: &String,
) -> Result<PrfsCircuitDriver, DbInterfaceError> {
    let query = r#"
SELECT * 
FROM prfs_circuit_drivers
WHERE circuit_driver_id=$1"#;

    // println!("query: {}", query);

    let row = sqlx::query(query)
        .bind(&circuit_driver_id)
        .fetch_one(pool)
        .await?;

    let prfs_circuit_driver = PrfsCircuitDriver {
        circuit_driver_id: row.try_get("circuit_driver_id")?,
        label: row.try_get("label")?,
        driver_repository_url: row.try_get("driver_repository_url")?,
        version: row.try_get("version")?,
        author: row.try_get("author")?,
        desc: row.try_get("desc")?,
        circuit_type_ids: row.try_get("circuit_type_ids")?,
        driver_properties_meta: row.try_get("driver_properties_meta")?,
        created_at: row.try_get("created_at")?,
    };

    return Ok(prfs_circuit_driver);
}

pub async fn get_prfs_circuit_drivers(
    pool: &Pool<Postgres>,
) -> Result<Vec<PrfsCircuitDriver>, DbInterfaceError> {
    let query = r#"
SELECT * 
FROM prfs_circuit_drivers
"#;

    // println!("query: {}", query);

    let rows = sqlx::query(query).fetch_all(pool).await.unwrap();

    let prfs_circuit_drivers = rows
        .iter()
        .map(|row| {
            Ok(PrfsCircuitDriver {
                circuit_driver_id: row.try_get("circuit_driver_id")?,
                label: row.try_get("label")?,
                driver_repository_url: row.try_get("driver_repository_url")?,
                version: row.try_get("version")?,
                author: row.try_get("author")?,
                desc: row.try_get("desc")?,
                circuit_type_ids: row.try_get("circuit_type_ids")?,
                driver_properties_meta: row.try_get("driver_properties_meta")?,
                created_at: row.try_get("created_at")?,
            })
        })
        .collect::<Result<Vec<PrfsCircuitDriver>, DbInterfaceError>>()?;

    return Ok(prfs_circuit_drivers);
}

pub async fn insert_prfs_circuit_driver(
    tx: &mut Transaction<'_, Postgres>,
    circuit_driver: &PrfsCircuitDriver,
) -> Result<String, DbInterfaceError> {
    let query = r#"
INSERT INTO prfs_circuit_drivers
(circuit_driver_id, driver_repository_url, version, author, "desc", circuit_type_ids,
driver_properties_meta, label)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
RETURNING circuit_driver_id"#;

    let row = sqlx::query(query)
        .bind(&circuit_driver.circuit_driver_id)
        .bind(&circuit_driver.driver_repository_url)
        .bind(&circuit_driver.version)
        .bind(&circuit_driver.author)
        .bind(&circuit_driver.desc)
        .bind(&circuit_driver.circuit_type_ids)
        .bind(&circuit_driver.driver_properties_meta)
        .bind(&circuit_driver.label)
        .fetch_one(&mut **tx)
        .await?;

    let circuit_driver_id: String = row.try_get("circuit_driver_id")?;

    Ok(circuit_driver_id)
}
