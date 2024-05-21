use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::{DateTimed, ShyProofWithProofType};

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct ShyComment {
    pub comment_id: String,
    pub topic_id: String,
    pub content: String,
    pub channel_id: String,
    pub author_public_key: String,
    pub author_sig: String,

    #[ts(type = "string[]")]
    pub author_proof_ids: Vec<String>,
}

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct ShyCommentWithProofs {
    pub shy_comment: DateTimed<ShyComment>,
    pub shy_proofs: Vec<ShyProofWithProofType>,
    // pub img_url: String,
    // pub expression: String,
    // pub public_inputs: String,
    // pub proof: Vec<u8>,
    // pub proof_public_key: String,
    // pub proof_type_id: String,
}
