use prfs_axum_lib::{reqwest::Client, resp::ApiResponse};
use prfs_entities::{CreatePrfsProofRecordRequest, CreatePrfsProofRecordResponse};

use crate::PrfsApiError;

pub async fn create_prfs_proof_record(
    prfs_api_server_endpoint: &String,
    data: &CreatePrfsProofRecordRequest,
) -> Result<ApiResponse<CreatePrfsProofRecordResponse>, PrfsApiError> {
    let cli = Client::new();

    let url = format!(
        "{}/api/v0/create_prfs_proof_record",
        prfs_api_server_endpoint,
    );

    let res = match cli.post(url).json(&data).send().await {
        Ok(res) => res,
        Err(err) => {
            return Err(format!("create prfs proof record fail, err; {}", err).into());
        }
    };

    let api_response: ApiResponse<CreatePrfsProofRecordResponse> = match res.json().await {
        Ok(r) => r,
        Err(err) => {
            return Err(format!(
                "Cannot parse create prfs proof record response, err; {}",
                err
            )
            .into());
        }
    };

    Ok(api_response)
}
