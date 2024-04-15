use prfs_axum_lib::{reqwest::Client, resp::ApiResponse};
use prfs_entities::{
    CreatePrfsProofRecordRequest, CreatePrfsProofRecordResponse, PrfsProofRecord,
    UpdatePrfsTreeByNewAtstRequest, UpdatePrfsTreeByNewAtstResponse,
};

use crate::PrfsApiError;

pub async fn create_prfs_proof_record(
    prfs_api_server_endpoint: &String,
    proof: &Vec<u8>,
    public_key: &String,
) -> Result<ApiResponse<CreatePrfsProofRecordResponse>, PrfsApiError> {
    let cli = Client::new();

    let proof_starts_with: [u8; 8] = proof[0..8].try_into()?;
    let create_prfs_proof_record_req = CreatePrfsProofRecordRequest {
        proof_record: PrfsProofRecord {
            public_key: public_key.to_string(),
            proof_starts_with,
        },
    };

    let url = format!(
        "{}/api/v0/create_prfs_proof_record",
        prfs_api_server_endpoint,
    );

    let res = match cli
        .post(url)
        .json(&create_prfs_proof_record_req)
        .send()
        .await
    {
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

pub async fn update_prfs_tree_by_new_atst(
    prfs_api_server_endpoint: &String,
    data: &UpdatePrfsTreeByNewAtstRequest,
) -> Result<ApiResponse<UpdatePrfsTreeByNewAtstResponse>, PrfsApiError> {
    let cli = Client::new();

    let url = format!(
        "{}/tree_api/v0/update_prfs_tree_by_new_atst",
        prfs_api_server_endpoint,
    );

    let res = match cli.post(url).json(&data).send().await {
        Ok(res) => res,
        Err(err) => {
            return Err(format!("create prfs proof record fail, err; {}", err).into());
        }
    };

    let api_response: ApiResponse<UpdatePrfsTreeByNewAtstResponse> = match res.json().await {
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
