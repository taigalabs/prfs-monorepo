use prfs_db_driver::sqlx::{self, Pool, Postgres, QueryBuilder, Row, Transaction};
use prfs_entities::entities::PrfsProofInstance;
use prfs_entities::prfs_api::PrfsProofInstanceSyn1;
use rust_decimal::Decimal;

use crate::DbInterfaceError;

pub async fn get_prfs_proof_instance_syn1_by_instance_id(
    pool: &Pool<Postgres>,
    proof_instance_id: &uuid::Uuid,
) -> Result<PrfsProofInstanceSyn1, DbInterfaceError> {
    let query = r#"
SELECT ppi.*, ppt.expression, ppt.img_url, ppt.label as proof_type_label, 
ppt.desc as proof_type_desc, ppt.circuit_driver_id, ppt.circuit_id, ppt.img_caption, 
pct.public_inputs_meta, ppt.circuit_type_id, ppt.author as proof_type_author, 
pct.desc as circuit_desc, pct.author as circuit_author, ppt.created_at as proof_type_created_at
FROM prfs_proof_instances ppi
INNER JOIN prfs_proof_types ppt ON ppi.proof_type_id=ppt.proof_type_id
INNER JOIN prfs_circuit_types pct ON pct.circuit_type_id=ppt.circuit_type_id
WHERE ppi.proof_instance_id=$1
"#;

    // println!("query: {}", query);

    let row = sqlx::query(query)
        .bind(&proof_instance_id)
        .fetch_one(pool)
        .await?;

    let prfs_proof_instance = PrfsProofInstanceSyn1 {
        proof_instance_id: row.try_get("proof_instance_id")?,
        proof_type_id: row.try_get("proof_type_id")?,
        prfs_ack_sig: row.try_get("prfs_ack_sig")?,
        proof: row.try_get("proof")?,
        short_id: row.try_get("short_id")?,
        expression: row.try_get("expression")?,
        img_url: row.try_get("img_url")?,
        img_caption: row.try_get("img_caption")?,
        circuit_id: row.try_get("circuit_id")?,
        circuit_driver_id: row.try_get("circuit_driver_id")?,
        proof_type_desc: row.try_get("proof_type_desc")?,
        public_inputs_meta: row.try_get("public_inputs_meta")?,
        proof_type_label: row.try_get("proof_type_label")?,
        public_inputs: row.try_get("public_inputs")?,
        created_at: row.try_get("created_at")?,
        circuit_type_id: row.try_get("circuit_type_id")?,
        proof_type_author: row.try_get("proof_type_author")?,
        circuit_desc: row.try_get("circuit_desc")?,
        circuit_author: row.try_get("circuit_author")?,
        proof_type_created_at: row.try_get("proof_type_created_at")?,
    };

    return Ok(prfs_proof_instance);
}

pub async fn get_prfs_proof_instance_by_short_id(
    pool: &Pool<Postgres>,
    short_id: &String,
) -> Result<PrfsProofInstance, DbInterfaceError> {
    let query = r#"
SELECT * from prfs_proof_instances
WHERE short_id=$1"#;

    // println!("query: {}", query);

    let row = sqlx::query(query).bind(&short_id).fetch_one(pool).await?;

    let prfs_proof_instance = PrfsProofInstance {
        proof_instance_id: row.try_get("proof_instance_id")?,
        short_id: row.try_get("short_id")?,
        prfs_ack_sig: row.try_get("prfs_ack_sig")?,
        proof_type_id: row.try_get("proof_type_id")?,
        proof: row.try_get("proof")?,
        public_inputs: row.try_get("public_inputs")?,
        created_at: row.try_get("created_at")?,
    };

    return Ok(prfs_proof_instance);
}

pub async fn get_prfs_proof_instances_syn1(
    pool: &Pool<Postgres>,
    page_idx: i32,
    page_size: i32,
) -> Result<(Vec<PrfsProofInstanceSyn1>, f32), DbInterfaceError> {
    let table_row_count: f32 = {
        let query = r#"
SELECT reltuples AS estimate 
FROM pg_class 
WHERE relname = 'prfs_proof_instances'
"#;
        let row = sqlx::query(query).fetch_one(pool).await?;

        row.try_get("estimate")?
    };

    let query = r#"
SELECT ppi.*, ppt.expression, ppt.img_url, ppt.label as proof_type_label, 
ppt.desc as proof_type_desc, ppt.circuit_driver_id, ppt.circuit_id, ppt.img_caption, 
pct.public_inputs_meta, ppt.circuit_type_id, ppt.author as proof_type_author, 
pct.desc as circuit_desc, pct.author as circuit_author, ppt.created_at as proof_type_created_at
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
        .await?;

    let prfs_proof_instances = rows
        .iter()
        .map(|row| {
            Ok(PrfsProofInstanceSyn1 {
                proof_instance_id: row.try_get("proof_instance_id")?,
                proof_type_id: row.try_get("proof_type_id")?,
                prfs_ack_sig: row.try_get("prfs_ack_sig")?,
                proof: row.try_get("proof")?,
                short_id: row.try_get("short_id")?,
                expression: row.try_get("expression")?,
                img_url: row.try_get("img_url")?,
                img_caption: row.try_get("img_caption")?,
                circuit_id: row.try_get("circuit_id")?,
                circuit_driver_id: row.try_get("circuit_driver_id")?,
                proof_type_desc: row.try_get("proof_type_desc")?,
                proof_type_label: row.try_get("proof_type_label")?,
                public_inputs_meta: row.try_get("public_inputs_meta")?,
                public_inputs: row.try_get("public_inputs")?,
                created_at: row.try_get("created_at")?,
                circuit_type_id: row.try_get("circuit_type_id")?,
                proof_type_author: row.try_get("proof_type_author")?,
                circuit_desc: row.try_get("circuit_desc")?,
                circuit_author: row.try_get("circuit_author")?,
                proof_type_created_at: row.try_get("proof_type_created_at")?,
            })
        })
        .collect::<Result<Vec<PrfsProofInstanceSyn1>, DbInterfaceError>>()?;

    return Ok((prfs_proof_instances, table_row_count));
}

pub async fn get_prfs_proof_instances(
    pool: &Pool<Postgres>,
    limit: Option<u32>,
) -> Result<Vec<PrfsProofInstance>, DbInterfaceError> {
    let query = r#"
SELECT * 
FROM prfs_proof_instances 
LIMIT $1
"#;

    // println!("query: {}", query);

    let limit = Decimal::from(20);

    let rows = sqlx::query(query).bind(&limit).fetch_all(pool).await?;

    let prfs_proof_instances = rows
        .iter()
        .map(|row| {
            Ok(PrfsProofInstance {
                proof_instance_id: row.try_get("proof_instance_id")?,
                proof_type_id: row.try_get("proof_type_id")?,
                prfs_ack_sig: row.try_get("prfs_ack_sig")?,
                short_id: row.try_get("short_id")?,
                proof: vec![],
                public_inputs: row.try_get("public_inputs")?,
                created_at: row.try_get("created_at")?,
            })
        })
        .collect::<Result<Vec<PrfsProofInstance>, DbInterfaceError>>()?;

    return Ok(prfs_proof_instances);
}

pub async fn insert_prfs_proof_instances(
    tx: &mut Transaction<'_, Postgres>,
    proof_instances: &Vec<PrfsProofInstance>,
) -> Result<String, DbInterfaceError> {
    let query = r#"
INSERT INTO prfs_proof_instances
(proof_instance_id, proof_type_id, proof, public_inputs, short_id, prfs_ack_sig)
VALUES ($1, $2, $3, $4, $5, $6) 
RETURNING proof_instance_id
"#;

    let proof_instance = proof_instances
        .get(0)
        .ok_or("proof instance should exist")?;

    let row = sqlx::query(query)
        .bind(&proof_instance.proof_instance_id)
        .bind(&proof_instance.proof_type_id)
        .bind(&proof_instance.proof)
        .bind(&proof_instance.public_inputs)
        .bind(&proof_instance.short_id)
        .bind(&proof_instance.prfs_ack_sig)
        .fetch_one(&mut **tx)
        .await?;

    let proof_instance_id: String = row.try_get("proof_instance_id")?;
    Ok(proof_instance_id)
}
