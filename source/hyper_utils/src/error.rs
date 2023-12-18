#[derive(Debug)]
pub struct ApiHandleError(
    pub ApiHandleErrorCode,
    pub Box<dyn std::error::Error + Send + Sync>,
);
// {
//     pub error_code: ApiHandleErrorCode,
//     pub err: Box<dyn std::error::Error + Send + Sync>,
// }

impl std::error::Error for ApiHandleError {}

impl std::fmt::Display for ApiHandleError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        std::fmt::Debug::fmt(&self.0, f)
    }
}

#[derive(Debug)]
pub struct ApiHandleErrorCode {
    pub code: u32,
    pub phrase: &'static str,
}
