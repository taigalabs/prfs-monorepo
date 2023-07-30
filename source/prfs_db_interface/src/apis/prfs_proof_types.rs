use crate::{
    database::Database,
    models::{PrfsProofType, PrfsSet},
    utils::{concat_cols, concat_values},
    DbInterfaceError,
};
use chrono::NaiveDate;

impl Database {
    pub async fn get_prfs_proof_types(&self, where_clause: &str) {}

    pub async fn insert_prfs_proof_types(
        &self,
        proof_types: &Vec<PrfsProofType>,
        // update_on_conflict: bool,
    ) {
    }
}
