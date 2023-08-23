use prfs_entities::sqlx::{self, types::Json, Pool, Postgres, Row, Transaction};
use prfs_entities::{
    entities::{PrfsProofInstance, PrfsProofType},
    syn_entities::PrfsProofInstanceSyn1,
};
use rust_decimal::Decimal;

pub async fn get_prfs_proof_instance_syn1(
    pool: &Pool<Postgres>,
    proof_instance_id: &uuid::Uuid,
) -> Vec<PrfsProofInstanceSyn1> {
    let query = "\
SELECT ppi.*, ppt.expression, ppt.img_url, ppt.label as proof_label, ppt.desc as proof_desc, \
ppt.driver_id, ppt.circuit_id \
FROM prfs_proof_instances ppi \
INNER JOIN prfs_proof_types ppt ON ppi.proof_type_id=ppt.proof_type_id \
WHERE ppi.proof_instance_id=$1";

    println!("query: {}", query);

    let rows = sqlx::query(query)
        .bind(&proof_instance_id)
        .fetch_all(pool)
        .await
        .unwrap();

    let prfs_proof_instances: Vec<PrfsProofInstanceSyn1> = rows
        .iter()
        .map(|row| PrfsProofInstanceSyn1 {
            proof_instance_id: row.get("proof_instance_id"),
            proof_type_id: row.get("proof_type_id"),
            proof: row.get("proof"),
            short_id: row.get("short_id"),
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
            proof_instance_id: row.get("proof_instance_id"),
            short_id: row.get("short_id"),
            proof_type_id: row.get("proof_type_id"),
            proof: row.get("proof"),
            public_inputs: row.get("public_inputs"),
            created_at: row.get("created_at"),
        })
        .collect();

    return prfs_proof_instances;
}

pub async fn get_prfs_proof_instance_by_short_id(
    pool: &Pool<Postgres>,
    short_id: &String,
) -> PrfsProofInstance {
    let query = "SELECT * from prfs_proof_instances where short_id=$1";

    println!("query: {}", query);

    let row = sqlx::query(query)
        .bind(&short_id)
        .fetch_one(pool)
        .await
        .unwrap();

    let prfs_proof_instance = PrfsProofInstance {
        proof_instance_id: row.get("proof_instance_id"),
        short_id: row.get("short_id"),
        proof_type_id: row.get("proof_type_id"),
        proof: row.get("proof"),
        public_inputs: row.get("public_inputs"),
        created_at: row.get("created_at"),
    };

    return prfs_proof_instance;
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
            proof_instance_id: row.get("proof_instance_id"),
            proof_type_id: row.get("proof_type_id"),
            proof: row.get("proof"),
            short_id: row.get("short_id"),
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
            proof_instance_id: row.get("proof_instance_id"),
            proof_type_id: row.get("proof_type_id"),
            short_id: row.get("short_id"),
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
) -> uuid::Uuid {
    let query = "INSERT INTO prfs_proof_instances \
            (proof_instance_id, proof_type_id, proof, public_inputs, short_id)
            VALUES ($1, $2, $3, $4, $5) returning proof_instance_id";

    let proof_instance = proof_instances.get(0).unwrap();

    let row = sqlx::query(query)
        .bind(&proof_instance.proof_instance_id)
        .bind(&proof_instance.proof_type_id)
        .bind(&proof_instance.proof)
        .bind(&proof_instance.public_inputs)
        .bind(&proof_instance.short_id)
        .fetch_one(&mut **tx)
        .await
        .unwrap();

    let proof_instance_id: uuid::Uuid = row.get("proof_instance_id");

    println!("proof_instance_id: {}", proof_instance_id);

    proof_instance_id
}
