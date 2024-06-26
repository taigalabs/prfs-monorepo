use prfs_db_driver::database2::Database2;
use prfs_db_driver::sqlx;
use prfs_db_interface::prfs;
use prfs_entities::{PrfsAtstGroup, PrfsAtstGroupMember, PrfsProofType};

use crate::seed::local::{
    load_circuit_drivers, load_circuit_input_types, load_circuit_types, load_circuits,
    load_policy_items, load_prfs_accounts,
};

pub async fn upload_prfs_accounts(db: &Database2) {
    let pool = &db.pool;
    let mut tx = pool.begin().await.unwrap();

    let prfs_accounts = load_prfs_accounts();
    println!("prfs_account: {:#?}", prfs_accounts);

    sqlx::query("truncate table prfs_accounts restart identity")
        .execute(&mut *tx)
        .await
        .unwrap();

    for prfs_account in prfs_accounts.values() {
        let sig = prfs::insert_prfs_account(&mut tx, prfs_account)
            .await
            .unwrap();
        println!("Inserted prfs account, sig: {}", sig);
    }

    tx.commit().await.unwrap();
}

pub async fn upload_policy_items(db: &Database2) {
    let pool = &db.pool;
    let mut tx = pool.begin().await.unwrap();

    let policy_items = load_policy_items();
    println!("policy items: {:#?}", policy_items);

    sqlx::query("truncate table prfs_policy_items restart identity")
        .execute(&mut *tx)
        .await
        .unwrap();

    for policy in policy_items.values() {
        let sig = prfs::insert_prfs_policy_item(&mut tx, policy)
            .await
            .unwrap();
        println!("Inserted prfs account, sig: {}", sig);
    }

    tx.commit().await.unwrap();
}

pub async fn upload_circuit_drivers(db: &Database2) {
    let pool = &db.pool;
    let mut tx = pool.begin().await.unwrap();

    let circuit_drivers = load_circuit_drivers();
    println!("circuit_drivers: {:#?}", circuit_drivers);

    sqlx::query("truncate table prfs_circuit_drivers restart identity")
        .execute(&mut *tx)
        .await
        .unwrap();

    for circuit_driver in circuit_drivers.values() {
        let circuit_driver_id = prfs::insert_prfs_circuit_driver(&mut tx, circuit_driver)
            .await
            .unwrap();
        println!("Inserted circuit_driver, id: {}", circuit_driver_id);
    }

    tx.commit().await.unwrap();
}

pub async fn upload_circuit_types(db: &Database2) {
    let pool = &db.pool;
    let mut tx = pool.begin().await.unwrap();

    let circuit_types = load_circuit_types();
    println!("circuit_types: {:#?}", circuit_types);

    sqlx::query("truncate table prfs_circuit_types restart identity")
        .execute(&mut *tx)
        .await
        .unwrap();

    for circuit_type in circuit_types.values() {
        prfs::insert_prfs_circuit_type(&mut tx, circuit_type).await;
    }

    tx.commit().await.unwrap();
}

pub async fn upload_circuit_input_types(db: &Database2) {
    let pool = &db.pool;
    let mut tx = pool.begin().await.unwrap();

    let circuit_input_types = load_circuit_input_types();
    println!("circuit_input_types: {:#?}", circuit_input_types);

    sqlx::query("truncate table prfs_circuit_input_types restart identity")
        .execute(&mut *tx)
        .await
        .unwrap();

    for circuit_input_type in circuit_input_types.values() {
        prfs::insert_prfs_circuit_input_type(&mut tx, circuit_input_type).await;
    }

    tx.commit().await.unwrap();
}

pub async fn upload_prfs_circuits(db: &Database2) {
    let pool = &db.pool;
    let mut tx = pool.begin().await.unwrap();

    let circuits = load_circuits();
    println!("circuits: {:#?}", circuits);

    for circuit in circuits.values() {
        prfs::upsert_prfs_circuit(&mut tx, circuit).await.unwrap();
    }

    tx.commit().await.unwrap();
}

pub async fn upload_prfs_proof_types(db: &Database2, proof_types: &Vec<PrfsProofType>) {
    let pool = &db.pool;
    let mut tx = pool.begin().await.unwrap();

    for proof_type in proof_types {
        prfs::insert_prfs_proof_type(&mut tx, proof_type)
            .await
            .unwrap();
    }

    tx.commit().await.unwrap();
}

pub async fn upload_prfs_atst_groups(db: &Database2, atst_groups: &Vec<PrfsAtstGroup>) {
    let pool = &db.pool;
    let mut tx = pool.begin().await.unwrap();

    for group in atst_groups {
        prfs::upsert_prfs_atst_group(&mut tx, group).await.unwrap();
    }

    tx.commit().await.unwrap();
}

pub async fn upload_prfs_atst_group_members(
    db: &Database2,
    atst_group_members: &Vec<PrfsAtstGroupMember>,
) {
    let pool = &db.pool;
    let mut tx = pool.begin().await.unwrap();

    let rows_affected = prfs::upsert_prfs_atst_group_members(&mut tx, &atst_group_members)
        .await
        .unwrap();
    println!("rows_affected: {}", rows_affected);

    tx.commit().await.unwrap();
}
