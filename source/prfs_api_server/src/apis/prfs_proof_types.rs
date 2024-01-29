use hyper::{body::Incoming, Request, Response};
use hyper_utils::{
    io::{parse_req, ApiHandlerResult, BytesBoxBody},
    resp::ApiResponse,
};
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::{
    entities::{CircuitInput, PrfsProofType, PrfsSet},
    prfs_api_entities::{
        CreatePrfsProofTypeRequest, CreatePrfsProofTypeResponse,
        GetPrfsProofTypeByProofTypeIdRequest, GetPrfsProofTypeByProofTypeIdResponse,
        GetPrfsProofTypesRequest, GetPrfsProofTypesResponse,
    },
    sqlx::types::Json,
};
use std::{convert::Infallible, sync::Arc};

const LIMIT: i32 = 10;

pub async fn get_prfs_proof_types(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> ApiHandlerResult {
    let req: GetPrfsProofTypesRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let rows = prfs::get_prfs_proof_types(pool, req.offset, LIMIT).await;

    let next_offset = if rows.len() < LIMIT.try_into().unwrap() {
        None
    } else {
        Some(req.offset + LIMIT)
    };

    let resp = ApiResponse::new_success(GetPrfsProofTypesResponse { next_offset, rows });

    return Ok(resp.into_hyper_response());
}

pub async fn get_prfs_proof_type_by_proof_type_id(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> ApiHandlerResult {
    let req: GetPrfsProofTypeByProofTypeIdRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let prfs_proof_type =
        prfs::get_prfs_proof_type_by_proof_type_id(pool, &req.proof_type_id).await;

    let resp = ApiResponse::new_success(GetPrfsProofTypeByProofTypeIdResponse { prfs_proof_type });

    return Ok(resp.into_hyper_response());
}

pub async fn create_prfs_proof_type(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> ApiHandlerResult {
    let req: CreatePrfsProofTypeRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();

    let prfs_proof_type = PrfsProofType {
        proof_type_id: req.proof_type_id,
        label: req.label.to_string(),
        author: req.author.to_string(),
        desc: req.desc.to_string(),
        expression: req.expression.to_string(),
        img_url: req.img_url,
        img_caption: req.img_caption,
        circuit_id: req.circuit_id,
        circuit_type_id: req.circuit_type_id.to_string(),
        circuit_driver_id: req.circuit_driver_id.to_string(),
        circuit_inputs: Json::from(req.circuit_inputs.clone()),
        driver_properties: Json::from(req.driver_properties.clone()),

        created_at: chrono::offset::Utc::now(),
    };

    let id = prfs::insert_prfs_proof_type(&mut tx, &prfs_proof_type).await;

    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(CreatePrfsProofTypeResponse { id });

    return Ok(resp.into_hyper_response());
}
