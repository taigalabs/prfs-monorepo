use chrono::{DateTime, NaiveDateTime, TimeZone, Utc};
use prfs_db_interface::database2::Database2;
use prfs_db_interface::db_apis;
use prfs_entities::entities::PrfsProofType;
use prfs_entities::sqlx::{self, types::Json};

use super::read::load_dynamic_sets;
use crate::seed::read::{
    load_circuit_drivers, load_circuit_input_types, load_circuit_types, load_circuits,
    load_proof_types,
};

pub async fn truncate(db: &Database2) {
    println!("Truncating tables...");

    let pool = &db.pool;
    let mut tx = pool.begin().await.unwrap();

    let tables = [
        "prfs_circuit_drivers",
        "prfs_circuit_input_types",
        "prfs_circuit_types",
        "prfs_circuits",
        "prfs_proof_types",
    ];

    for table in tables {
        sqlx::query(&format!("truncate table {} restart identity", table))
            .execute(&mut *tx)
            .await
            .unwrap();
    }

    tx.commit().await.unwrap();

    println!("Truncated tables, {:?}", tables);
}

pub async fn upload(db: &Database2) {
    let pool = &db.pool;
    let mut tx = pool.begin().await.unwrap();

    {
        let circuit_drivers = load_circuit_drivers();
        println!("circuit_drivers: {:#?}", circuit_drivers);

        for circuit_driver in circuit_drivers.values() {
            let circuit_driver_id =
                db_apis::insert_prfs_circuit_driver(&mut tx, circuit_driver).await;
            println!("Inserted circuit_driver, id: {}", circuit_driver_id);
        }
    }

    {
        let circuit_types = load_circuit_types();
        println!("circuit_types: {:#?}", circuit_types);

        for circuit_type in circuit_types.values() {
            db_apis::insert_prfs_circuit_type(&mut tx, circuit_type).await;
        }
    }

    {
        let circuit_input_types = load_circuit_input_types();
        println!("circuit_input_types: {:#?}", circuit_input_types);

        for circuit_input_type in circuit_input_types.values() {
            db_apis::insert_prfs_circuit_input_type(&mut tx, circuit_input_type).await;
        }
    }

    {
        let circuits = load_circuits();
        println!("circuits: {:#?}", circuits);

        for circuit in circuits.values() {
            db_apis::insert_prfs_circuit(&mut tx, circuit).await;
        }
    }

    {
        let proof_types = load_proof_types();
        println!("proof types: {:#?}", proof_types);

        for proof_type in proof_types.values() {
            db_apis::insert_prfs_proof_type(&mut tx, proof_type).await;
        }
    }

    {
        let sets = load_dynamic_sets();
        println!("sets: {:#?}", sets);

        for prfs_set in sets.values() {
            db_apis::upsert_prfs_set(&mut tx, prfs_set).await.unwrap();
        }
    }

    tx.commit().await.unwrap();
}
