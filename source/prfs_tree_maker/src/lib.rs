pub mod apis;
pub mod constants;
pub mod geth;
pub mod hexutils;
pub mod paths;
pub mod proof_type_json;

pub type TreeMakerError = Box<dyn std::error::Error + Send + Sync>;
