use crate::database2::Database2;
use prfs_entities::{
    entities::{PrfsProofInstance, PrfsProofType},
    syn_entities::PrfsProofInstanceSyn1,
};
use rust_decimal::Decimal;
use sqlx::{types::Json, Pool, Postgres, Row, Transaction};

pub async fn get_prfs_proof_instance_syn1(
    pool: &Pool<Postgres>,
    id: &i64,
) -> Vec<PrfsProofInstanceSyn1> {
    let query = "\
SELECT ppi.*, ppt.expression, ppt.img_url, ppt.label as proof_label, ppt.desc as proof_desc, \
ppt.driver_id, ppt.circuit_id \
FROM prfs_proof_instances ppi \
INNER JOIN prfs_proof_types ppt ON ppi.proof_type_id=ppt.proof_type_id \
WHERE ppi.id=$1";

    println!("query: {}", query);

    let rows = sqlx::query(query).bind(&id).fetch_all(pool).await.unwrap();

    let prfs_proof_instances: Vec<PrfsProofInstanceSyn1> = rows
        .iter()
        .map(|row| PrfsProofInstanceSyn1 {
            id: row.get("id"),
            proof_type_id: row.get("proof_type_id"),
            proof: row.get("proof"),
            expression: row.get("expression"),
            img_url: row.get("img_url"),
            circuit_id: row.get("circuit_id"),
            driver_id: row.get("driver_id"),
            proof_desc: row.get("proof_desc"),
            proof_label: row.get("proof_label"),
            public_inputs: row.get("public_inputs"),
            created_at: row.get("created_at"),
        })
        .collect();

    return prfs_proof_instances;
}

pub async fn get_prfs_proof_instance(pool: &Pool<Postgres>, id: &i64) -> Vec<PrfsProofInstance> {
    let query = "SELECT * from prfs_proof_instances where proof_instance_id=$1";

    println!("query: {}", query);

    let rows = sqlx::query(query).bind(&id).fetch_all(pool).await.unwrap();

    let prfs_proof_instances: Vec<PrfsProofInstance> = rows
        .iter()
        .map(|row| PrfsProofInstance {
            id: row.get("id"),
            proof_type_id: row.get("proof_type_id"),
            proof: row.get("proof"),
            public_inputs: row.get("public_inputs"),
            created_at: row.get("created_at"),
        })
        .collect();

    return prfs_proof_instances;
}

pub async fn get_prfs_proof_instances_syn1(
    pool: &Pool<Postgres>,
    limit: Option<u32>,
) -> Vec<PrfsProofInstanceSyn1> {
    // let query = "SELECT * from prfs_proof_instances limit $1";

    let query = "\
SELECT ppi.*, ppt.expression, ppt.img_url, ppt.label as proof_label, ppt.desc as proof_desc, \
ppt.driver_id, ppt.circuit_id \
FROM prfs_proof_instances ppi \
INNER JOIN prfs_proof_types ppt ON ppi.proof_type_id=ppt.proof_type_id \
limit $1";

    println!("query: {}", query);

    let limit = Decimal::from(20);

    let rows = sqlx::query(query)
        .bind(&limit)
        .fetch_all(pool)
        .await
        .unwrap();

    let prfs_proof_instances: Vec<PrfsProofInstanceSyn1> = rows
        .iter()
        .map(|row| PrfsProofInstanceSyn1 {
            id: row.get("id"),
            proof_type_id: row.get("proof_type_id"),
            proof: row.get("proof"),
            expression: row.get("expression"),
            img_url: row.get("img_url"),
            circuit_id: row.get("circuit_id"),
            driver_id: row.get("driver_id"),
            proof_desc: row.get("proof_desc"),
            proof_label: row.get("proof_label"),
            public_inputs: row.get("public_inputs"),
            created_at: row.get("created_at"),
        })
        .collect();

    return prfs_proof_instances;
}

pub async fn get_prfs_proof_instances(
    pool: &Pool<Postgres>,
    limit: Option<u32>,
) -> Vec<PrfsProofInstance> {
    let query = "SELECT * from prfs_proof_instances limit $1";

    println!("query: {}", query);

    let limit = Decimal::from(20);

    let rows = sqlx::query(query)
        .bind(&limit)
        .fetch_all(pool)
        .await
        .unwrap();

    let prfs_proof_instances: Vec<PrfsProofInstance> = rows
        .iter()
        .map(|row| PrfsProofInstance {
            id: row.get("id"),
            proof_type_id: row.get("proof_type_id"),
            proof: vec![],
            public_inputs: row.get("public_inputs"),
            created_at: row.get("created_at"),
        })
        .collect();

    return prfs_proof_instances;
}

pub async fn insert_prfs_proof_instances(
    tx: &mut Transaction<'_, Postgres>,
    proof_instances: &Vec<PrfsProofInstance>,
) -> i64 {
    let query = "INSERT INTO prfs_proof_instances \
            (proof_type_id, proof, public_inputs)
            VALUES ($1, $2, $3) returning id";

    let proof_instance = proof_instances.get(0).unwrap();

    let row = sqlx::query(query)
        .bind(&proof_instance.proof_type_id)
        .bind(&proof_instance.proof)
        .bind(&proof_instance.public_inputs)
        .fetch_one(&mut **tx)
        .await
        .unwrap();

    let id: i64 = row.get("id");

    println!("proof_instance_id: {}", id);

    id
}
