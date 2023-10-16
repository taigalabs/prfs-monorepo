use prfs_entities::entities::{
    PrfsAccount, PrfsCircuitDriver, PrfsPolicyItem, PrfsProofType, PrfsSet,
};
use prfs_entities::entities::{PrfsCircuitInputType, PrfsCircuitType};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;

// #[derive(Serialize, Deserialize, Clone, Debug)]
// pub struct CircuitDriversJson {
//     pub circuit_drivers: Vec<PrfsCircuitDriver>,
// }

// #[derive(Serialize, Deserialize, Clone, Debug)]
// pub struct CircuitTypesJson {
//     pub circuit_types: Vec<PrfsCircuitType>,
// }

// #[derive(Serialize, Deserialize, Clone, Debug)]
// pub struct CircuitInputTypesJson {
//     pub circuit_input_types: Vec<PrfsCircuitInputType>,
// }

// #[derive(Serialize, Deserialize, Clone, Debug)]
// pub struct PrfsAccountsJson {
//     pub prfs_accounts: Vec<PrfsAccount>,
// }

// #[derive(Serialize, Deserialize, Clone, Debug)]
// pub struct PrfsPolicyItemsJson {
//     pub prfs_policy_items: Vec<PrfsPolicyItem>,
// }

// #[derive(Serialize, Deserialize, Clone, Debug)]
// pub struct ProofTypesJson {
//     pub proof_types: Vec<PrfsProofType>,
// }

// #[derive(Serialize, Deserialize, Clone, Debug)]
// pub struct DynamicSetsJson {
//     pub dynamic_sets: Vec<DynamicSetJson>,
// }

// #[derive(Serialize, Deserialize, Clone, Debug)]
// pub struct DynamicSetJson {
//     pub prfs_set: PrfsSet,
//     pub elements_path: String,
// }

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct SetElementRecord {
    pub val: String,
    pub meta: String,
}
