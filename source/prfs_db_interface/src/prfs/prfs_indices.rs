use prfs_entities::entities::PrfsProofType;

pub async fn get_least_recent_prfs_index(
    pool: &Pool<Postgres>,
    proof_type_id: &String,
) -> PrfsProofType {
    let query = "SELECT * from prfs_proof_types where proof_type_id=$1";

    let row = sqlx::query(query)
        .bind(&proof_type_id)
        .fetch_one(pool)
        .await
        .unwrap();

    let ret = PrfsProofType {
        proof_type_id: row.get("proof_type_id"),
        expression: row.get("expression"),
        img_url: row.get("img_url"),
        img_caption: row.get("img_caption"),
        label: row.get("label"),
        author: row.get("author"),
        desc: row.get("desc"),
        circuit_id: row.get("circuit_id"),
        circuit_type_id: row.get("circuit_type_id"),
        circuit_inputs: row.get("circuit_inputs"),
        circuit_driver_id: row.get("circuit_driver_id"),
        driver_properties: row.get("driver_properties"),
        created_at: row.get("created_at"),
    };

    return ret;
}
