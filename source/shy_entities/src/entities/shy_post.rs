use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct ShyPost {
    pub post_id: String,
    pub topic_id: String,
    pub content: String,
    pub channel_id: String,
    pub shy_proof_id: String,
    pub author_public_key: String,
    pub author_sig: String,
    pub author_proof_identity_inputs: Vec<String>,
}

// #[derive(TS, Debug, Serialize, Deserialize, Clone)]
// #[ts(export)]
// pub struct ShyPostSyn1 {
//     pub shy_post: ShyPost,
//     pub proof_identity_input: String,
// }
