use crate::{database2::Database2, entities::PrfsProofType};
use sqlx::Row;

impl Database2 {
    pub async fn get_prfs_proof_type(&self, proof_type_id: &String) -> Vec<PrfsProofType> {
        let query = "SELECT * from prfs_proof_types where proof_type_id=$1";

        let rows = sqlx::query(query)
            .bind(&proof_type_id)
            .fetch_all(&self.pool)
            .await
            .unwrap();

        let prfs_proof_types: Vec<PrfsProofType> = rows
            .iter()
            .map(|row| PrfsProofType {
                proof_type_id: row.get("proof_type_id"),
                label: row.get("label"),
                author: row.get("author"),
                desc: row.get("desc"),
                circuit_id: row.get("circuit_id"),
                program_id: row.get("program_id"),
                public_input_instance: row.get("public_input_instance"),
                created_at: row.get("created_at"),
            })
            .collect();

        return prfs_proof_types;
    }

    pub async fn get_prfs_proof_types(&self) -> Vec<PrfsProofType> {
        let query = "SELECT * from prfs_proof_types";

        let rows = sqlx::query(query).fetch_all(&self.pool).await.unwrap();

        let prfs_proof_types: Vec<PrfsProofType> = rows
            .iter()
            .map(|row| PrfsProofType {
                proof_type_id: row.get("proof_type_id"),
                label: row.get("label"),
                author: row.get("author"),
                desc: row.get("desc"),
                circuit_id: row.get("circuit_id"),
                program_id: row.get("program_id"),
                public_input_instance: row.get("public_input_instance"),
                created_at: row.get("created_at"),
            })
            .collect();

        return prfs_proof_types;
    }

    pub async fn insert_prfs_proof_types(&self, proof_types: &Vec<PrfsProofType>) {
        let query = "INSERT INTO prfs_proof_types \
            (proof_type_id, author, label, \"desc\", circuit_id, public_input_instance, program_id) \
            VALUES ($1, $2, $3, $4, $5, $6, $7) returning proof_type_id";

        let proof_type = proof_types.get(0).unwrap();

        let row = sqlx::query(query)
            .bind(&proof_type.proof_type_id)
            .bind(&proof_type.author)
            .bind(&proof_type.label)
            .bind(&proof_type.desc)
            .bind(&proof_type.circuit_id)
            .bind(&proof_type.public_input_instance)
            .bind(&proof_type.program_id)
            .fetch_one(&self.pool)
            .await
            .unwrap();

        let proof_type_id: String = row.get("proof_type_id");

        println!("proof_type_id: {}", proof_type_id);
    }
}
