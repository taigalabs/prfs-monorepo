use prfs_entities::entities::PrfsCircuitDriver;
use prfs_entities::sqlx::{self, types::Json, Pool, Postgres, Row, Transaction};

pub async fn get_prfs_circuit_driver_by_circuit_driver_id(
    pool: &Pool<Postgres>,
    circuit_driver_id: &String,
) -> PrfsCircuitDriver {
    let query = r#"
SELECT * 
FROM prfs_circuit_drivers
WHERE circuit_driver_id=$1"#;

    // println!("query: {}", query);

    let row = sqlx::query(query)
        .bind(&circuit_driver_id)
        .fetch_one(pool)
        .await
        .unwrap();

    let prfs_circuit_driver = PrfsCircuitDriver {
        circuit_driver_id: row.get("circuit_driver_id"),
        label: row.get("label"),
        driver_repository_url: row.get("driver_repository_url"),
        version: row.get("version"),
        author: row.get("author"),
        desc: row.get("desc"),
        circuit_type_ids: row.get("circuit_type_ids"),
        driver_properties_meta: row.get("driver_properties_meta"),
        created_at: row.get("created_at"),
    };

    return prfs_circuit_driver;
}

pub async fn get_prfs_circuit_drivers(pool: &Pool<Postgres>) -> Vec<PrfsCircuitDriver> {
    let query = r#"
SELECT * 
FROM prfs_circuit_drivers
"#;

    // println!("query: {}", query);

    let rows = sqlx::query(query).fetch_all(pool).await.unwrap();

    let prfs_circuit_drivers: Vec<PrfsCircuitDriver> = rows
        .iter()
        .map(|row| PrfsCircuitDriver {
            circuit_driver_id: row.get("circuit_driver_id"),
            label: row.get("label"),
            driver_repository_url: row.get("driver_repository_url"),
            version: row.get("version"),
            author: row.get("author"),
            desc: row.get("desc"),
            circuit_type_ids: row.get("circuit_type_ids"),
            driver_properties_meta: row.get("driver_properties_meta"),
            created_at: row.get("created_at"),
        })
        .collect();

    return prfs_circuit_drivers;
}

pub async fn insert_prfs_circuit_driver(
    tx: &mut Transaction<'_, Postgres>,
    circuit_driver: &PrfsCircuitDriver,
) -> String {
    let query = r#"
INSERT INTO prfs_circuit_drivers
(circuit_driver_id, driver_repository_url, version, author, "desc", circuit_type_ids,
driver_properties_meta, label)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8) returning circuit_driver_id"#;

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
        .await
        .unwrap();

    let circuit_driver_id: String = row.get("circuit_driver_id");

    circuit_driver_id
}
