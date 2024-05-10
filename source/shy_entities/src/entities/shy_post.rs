use serde::{Deserialize, Serialize};
use ts_rs::TS;

use super::ProofIdentity;

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct ShyPost {
    pub post_id: String,
    pub topic_id: String,
    pub content: String,
    pub channel_id: String,
    // pub shy_proof_id: String,
    pub author_public_key: String,
    pub author_sig: String,

    #[ts(type = "Record<string, any>")]
    pub author_proof_identities: sqlx::types::Json<Vec<ProofIdentity>>,
}

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct ShyPostSyn1 {
    pub shy_post: ShyPost,
    pub img_url: String,
    pub expression: String,
    pub public_inputs: String,
    pub proof: Vec<u8>,
    pub proof_public_key: String,
    pub proof_type_id: String,
}
