use serde::{Deserialize, Serialize};

#[derive(Debug)]
pub struct ApiHandleError {
    pub error_code: ApiHandleErrorCode,
    pub err: Box<dyn std::error::Error + Send + Sync>,
}

impl std::error::Error for ApiHandleError {}

impl std::fmt::Display for ApiHandleError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        std::fmt::Debug::fmt(&self.error_code, f)
    }
}

impl ApiHandleError {
    pub fn from(
        error_code: &ApiHandleErrorCode,
        err: Box<dyn std::error::Error + Send + Sync>,
    ) -> ApiHandleError {
        ApiHandleError {
            error_code: error_code.clone(),
            err,
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ApiHandleErrorCode {
    pub code: String,
    pub phrase: String,
}
