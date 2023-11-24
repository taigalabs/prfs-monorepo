use prfs_entities::sqlx::{self, types::Json, Pool, Postgres, Row, Transaction};
use prfs_entities::{
    entities::{PrfsProofInstance, PrfsProofType},
    syn_entities::PrfsProofInstanceSyn1,
};
use rust_decimal::Decimal;

pub async fn get_prfs_proof_instance_syn1_by_instance_id(
    pool: &Pool<Postgres>,
    proof_instance_id: &uuid::Uuid,
) -> PrfsProofInstanceSyn1 {
    let query = r#"
SELECT ppi.*, ppt.expression, ppt.img_url, ppt.label as proof_label, ppt.desc as proof_desc,
ppt.circuit_driver_id, ppt.circuit_id, ppt.img_caption, pct.public_inputs_meta, 
ppt.circuit_type_id, ppt.author as proof_type_author, pct.desc as circuit_desc,
pct.author as circuit_author
FROM prfs_proof_instances ppi
INNER JOIN prfs_proof_types ppt ON ppi.proof_type_id=ppt.proof_type_id
INNER JOIN prfs_circuit_types pct ON pct.circuit_type_id=ppt.circuit_type_id
WHERE ppi.proof_instance_id=$1
"#;

    // println!("query: {}", query);

    let row = sqlx::query(query)
        .bind(&proof_instance_id)
        .fetch_one(pool)
        .await
        .expect(&format!("proof_instance_id: {}", proof_instance_id));

    let prfs_proof_instance = PrfsProofInstanceSyn1 {
        proof_instance_id: row.get("proof_instance_id"),
        proof_type_id: row.get("proof_type_id"),
        prfs_ack_sig: row.get("prfs_ack_sig"),
        proof: row.get("proof"),
        short_id: row.get("short_id"),
        expression: row.get("expression"),
        img_url: row.get("img_url"),
        img_caption: row.get("img_caption"),
        circuit_id: row.get("circuit_id"),
        circuit_driver_id: row.get("circuit_driver_id"),
        proof_desc: row.get("proof_desc"),
        public_inputs_meta: row.get("public_inputs_meta"),
        proof_label: row.get("proof_label"),
        public_inputs: row.get("public_inputs"),
        created_at: row.get("created_at"),
        circuit_type_id: row.get("circuit_type_id"),
        proof_type_author: row.get("proof_type_author"),
        circuit_desc: row.get("circuit_desc"),
        circuit_author: row.get("circuit_author"),
    };

    return prfs_proof_instance;
}

pub async fn get_prfs_proof_instance_by_short_id(
    pool: &Pool<Postgres>,
    short_id: &String,
) -> PrfsProofInstance {
    let query = "SELECT * from prfs_proof_instances where short_id=$1";

    // println!("query: {}", query);

    let row = sqlx::query(query)
        .bind(&short_id)
        .fetch_one(pool)
        .await
        .unwrap();

    let prfs_proof_instance = PrfsProofInstance {
        proof_instance_id: row.get("proof_instance_id"),
        short_id: row.get("short_id"),
        prfs_ack_sig: row.get("prfs_ack_sig"),
        proof_type_id: row.get("proof_type_id"),
        proof: row.get("proof"),
        public_inputs: row.get("public_inputs"),
        created_at: row.get("created_at"),
    };

    return prfs_proof_instance;
}

pub async fn get_prfs_proof_instances_syn1(
    pool: &Pool<Postgres>,
    page_idx: i32,
    page_size: i32,
) -> (Vec<PrfsProofInstanceSyn1>, f32) {
    let table_row_count: f32 = {
        let query = r#"
SELECT reltuples AS estimate FROM pg_class where relname = 'prfs_proof_instances';
"#;
        let row = sqlx::query(query).fetch_one(pool).await.unwrap();

        row.get("estimate")
    };

    let query = r#"
SELECT ppi.*, ppt.expression, ppt.img_url, ppt.label as proof_label, ppt.desc as proof_desc,
ppt.circuit_driver_id, ppt.circuit_id, ppt.img_caption, pct.public_inputs_meta, 
ppt.circuit_type_id, ppt.author as proof_type_author, pct.desc as circuit_desc,
pct.author as circuit_author
FROM prfs_proof_instances ppi
INNER JOIN prfs_proof_types ppt ON ppi.proof_type_id=ppt.proof_type_id
INNER JOIN prfs_circuit_types pct ON pct.circuit_type_id=ppt.circuit_type_id
ORDER BY ppi.created_at
OFFSET $1
LIMIT $2
"#;

    // println!("query: {}", query);

    let rows = sqlx::query(query)
        .bind(page_idx * page_size)
        .bind(&page_size)
        .fetch_all(pool)
        .await
        .unwrap();

    let prfs_proof_instances: Vec<PrfsProofInstanceSyn1> = rows
        .iter()
        .map(|row| PrfsProofInstanceSyn1 {
            proof_instance_id: row.get("proof_instance_id"),
            proof_type_id: row.get("proof_type_id"),
            prfs_ack_sig: row.get("prfs_ack_sig"),
            proof: row.get("proof"),
            short_id: row.get("short_id"),
            expression: row.get("expression"),
            img_url: row.get("img_url"),
            img_caption: row.get("img_caption"),
            circuit_id: row.get("circuit_id"),
            circuit_driver_id: row.get("circuit_driver_id"),
            proof_desc: row.get("proof_desc"),
            proof_label: row.get("proof_label"),
            public_inputs_meta: row.get("public_inputs_meta"),
            public_inputs: row.get("public_inputs"),
            created_at: row.get("created_at"),
            circuit_type_id: row.get("circuit_type_id"),
            proof_type_author: row.get("proof_type_author"),
            circuit_desc: row.get("circuit_desc"),
            circuit_author: row.get("circuit_author"),
        })
        .collect();

    return (prfs_proof_instances, table_row_count);
}

pub async fn get_prfs_proof_instances(
    pool: &Pool<Postgres>,
    limit: Option<u32>,
) -> Vec<PrfsProofInstance> {
    let query = "SELECT * from prfs_proof_instances limit $1";

    // println!("query: {}", query);

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
            prfs_ack_sig: row.get("prfs_ack_sig"),
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
            (proof_instance_id, proof_type_id, proof, public_inputs, short_id, prfs_ack_sig)
            VALUES ($1, $2, $3, $4, $5, $6) returning proof_instance_id";

    let proof_instance = proof_instances.get(0).unwrap();

    let row = sqlx::query(query)
        .bind(&proof_instance.proof_instance_id)
        .bind(&proof_instance.proof_type_id)
        .bind(&proof_instance.proof)
        .bind(&proof_instance.public_inputs)
        .bind(&proof_instance.short_id)
        .bind(&proof_instance.prfs_ack_sig)
        .fetch_one(&mut **tx)
        .await
        .unwrap();

    let proof_instance_id: uuid::Uuid = row.get("proof_instance_id");

    println!("proof_instance_id: {}", proof_instance_id);

    proof_instance_id
}
