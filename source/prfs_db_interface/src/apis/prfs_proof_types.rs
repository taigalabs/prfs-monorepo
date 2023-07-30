use crate::{
    database::Database,
    database2::Database2,
    models::{PrfsProofType, PrfsSet},
    utils::{concat_cols, concat_values},
    DbInterfaceError,
};
use chrono::NaiveDate;

impl Database2 {
    pub async fn get_prfs_proof_types(&self, where_clause: &str) {}

    pub async fn insert_prfs_proof_types(
        &self,
        proof_types: &Vec<PrfsProofType>,
        // update_on_conflict: bool,
    ) {
        println!("2");

        let query = "INSERT INTO prfs_proof_types (proof_type_id, author, label, \"desc\", circuit_id, public_inputs) VALUES ($1, $2, $3, $4, $5, $6)";

        let proof_type = proof_types.get(0).unwrap();

        sqlx::query(query)
            .bind(&proof_type.proof_type_id)
            .bind(&proof_type.author)
            .bind(&proof_type.label)
            .bind(&proof_type.desc)
            .bind(&proof_type.circuit_id)
            .bind(&proof_type.public_inputs)
            .execute(&self.pool)
            .await
            .unwrap();
    }
}
