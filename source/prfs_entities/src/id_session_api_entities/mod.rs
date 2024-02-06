use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use sqlx::prelude::Type;
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct PrfsSignUpRequest2 {
    pub account_id: String,
    pub public_key: String,
    pub avatar_color: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[allow(non_camel_case_types)]
#[ts(export)]
pub enum PrfsIdSessionMsg {
    RequestSignIn(RequestSignInPayload),
    RequestProofGen(RequestProofGenPayload),
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct RequestSignInPayload {
    app_id: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct RequestProofGenPayload {
    app_id: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, Type, TS)]
#[sqlx(type_name = "VARCHAR")]
#[allow(non_camel_case_types)]
#[ts(export)]
pub enum PrfsIdMsgType {
    HANDSHAKE,
    SIGN_IN_RESULT,
    PROOF_GEN_RESULT,
    VERIFY_PROOF_RESULT,
    REQUEST_SIGN_IN,
    REQUEST_PROOF_GEN,
    REQUEST_VERIFY_PROOF,
    GET_MSG,
}
