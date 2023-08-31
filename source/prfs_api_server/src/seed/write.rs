use chrono::{DateTime, NaiveDateTime, TimeZone, Utc};
use prfs_db_interface::database2::Database2;
use prfs_db_interface::db_apis;
use prfs_entities::entities::{PrfsProofType, PrfsTreeNode};
use prfs_entities::sqlx::{self, types::Json};
use prfs_tree_maker::tree_maker_apis;
use rust_decimal::Decimal;
use std::path::PathBuf;

use super::read::load_dynamic_sets;
use crate::paths::PATHS;
use crate::seed::json::SetElementRecord;
use crate::seed::read::{
    load_circuit_drivers, load_circuit_input_types, load_circuit_types, load_circuits,
    load_proof_types,
};
use crate::seed::utils;

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
    upload_circuit_drivers(&db).await;
    upload_circuit_types(&db).await;
    upload_circuit_input_types(&db).await;
    upload_circuits(&db).await;
    upload_proof_types(&db).await;
    // upload_dynamic_sets(&db).await;
}

async fn upload_circuit_drivers(db: &Database2) {
    let pool = &db.pool;
    let mut tx = pool.begin().await.unwrap();

    let circuit_drivers = load_circuit_drivers();
    println!("circuit_drivers: {:#?}", circuit_drivers);

    for circuit_driver in circuit_drivers.values() {
        let circuit_driver_id = db_apis::insert_prfs_circuit_driver(&mut tx, circuit_driver).await;
        println!("Inserted circuit_driver, id: {}", circuit_driver_id);
    }

    tx.commit().await.unwrap();
}

async fn upload_circuit_types(db: &Database2) {
    let pool = &db.pool;
    let mut tx = pool.begin().await.unwrap();

    let circuit_types = load_circuit_types();
    println!("circuit_types: {:#?}", circuit_types);

    for circuit_type in circuit_types.values() {
        db_apis::insert_prfs_circuit_type(&mut tx, circuit_type).await;
    }

    tx.commit().await.unwrap();
}

async fn upload_circuit_input_types(db: &Database2) {
    let pool = &db.pool;
    let mut tx = pool.begin().await.unwrap();

    let circuit_input_types = load_circuit_input_types();
    println!("circuit_input_types: {:#?}", circuit_input_types);

    for circuit_input_type in circuit_input_types.values() {
        db_apis::insert_prfs_circuit_input_type(&mut tx, circuit_input_type).await;
    }

    tx.commit().await.unwrap();
}

async fn upload_circuits(db: &Database2) {
    let pool = &db.pool;
    let mut tx = pool.begin().await.unwrap();

    let circuits = load_circuits();
    println!("circuits: {:#?}", circuits);

    for circuit in circuits.values() {
        db_apis::insert_prfs_circuit(&mut tx, circuit).await;
    }

    tx.commit().await.unwrap();
}

async fn upload_proof_types(db: &Database2) {
    let pool = &db.pool;
    let mut tx = pool.begin().await.unwrap();

    let proof_types = load_proof_types();
    println!("proof types: {:#?}", proof_types);

    for proof_type in proof_types.values() {
        db_apis::insert_prfs_proof_type(&mut tx, proof_type).await;
    }

    tx.commit().await.unwrap();
}

async fn upload_dynamic_sets(db: &Database2) {
    let pool = &db.pool;
    let mut tx = pool.begin().await.unwrap();

    let mut dynamic_sets = load_dynamic_sets();
    println!("sets: {:#?}", dynamic_sets);

    for dynamic_set in dynamic_sets.values_mut() {
        let set_id = db_apis::upsert_prfs_set(&mut tx, &dynamic_set.prfs_set)
            .await
            .unwrap();

        let rows_updated = db_apis::delete_prfs_tree_nodes(&mut tx, &set_id)
            .await
            .unwrap();

        println!("Deleted {} prfs tree nodes", rows_updated);

        let elements_path = PATHS.data.join(&dynamic_set.elements_path);

        let mut rdr = csv::Reader::from_path(elements_path).unwrap();

        let mut nodes = vec![];
        for (idx, result) in rdr.deserialize().enumerate() {
            let record: SetElementRecord = result.unwrap();

            let prfs_tree_node = PrfsTreeNode {
                pos_w: Decimal::from(idx),
                pos_h: 0,
                val: record.val,
                meta: Some(record.meta),
                set_id,
            };

            nodes.push(prfs_tree_node);
        }

        let mut prfs_set = &mut dynamic_set.prfs_set;
        prfs_set.cardinality = nodes.len() as i64;

        tree_maker_apis::create_tree_nodes(&mut tx, &mut prfs_set, &nodes)
            .await
            .unwrap();

        let rows_affected = db_apis::insert_prfs_tree_nodes(&mut tx, &nodes, true)
            .await
            .unwrap();

        println!("Rows affected: {}", rows_affected);
    }

    tx.commit().await.unwrap();
}
