use ethers_signers::Signer;
use hyper::body::Incoming;
use hyper::{Request, Response};
use hyper_utils::io::{parse_req, ApiHandlerResult, BytesBoxBody};
use hyper_utils::resp::ApiResponse;
use prfs_common_server_state::ServerState;
use prfs_db_interface::db_apis;
use prfs_entities::apis_entities::{
    CreatePrfsPollRequest, CreatePrfsPollResponse, GetPrfsPollByPollIdRequest,
    GetPrfsPollByPollIdResponse, GetPrfsPollResultByPollIdRequest,
    GetPrfsPollResultByPollIdResponse, GetPrfsPollsRequest, GetPrfsPollsResponse,
    SubmitPrfsPollResponseRequest, SubmitPrfsPollResponseResponse,
};
use prfs_entities::entities::{PrfsPoll, PrfsProofInstance};
use prfs_entities::social_api_entities::{
    CreateSocialPostRequest, GetSocialPostsRequest, GetSocialPostsResponse,
};
use std::{convert::Infallible, sync::Arc};
use uuid::Uuid;

pub async fn create_social_post(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> ApiHandlerResult {
    let state = state.clone();
    let req: CreateSocialPostRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();

    let poll_id = db_apis::insert_social_post(&mut tx, &req.post).await;

    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(CreatePrfsPollResponse { poll_id });

    return Ok(resp.into_hyper_response());
}

pub async fn get_social_posts(req: Request<Incoming>, state: Arc<ServerState>) -> ApiHandlerResult {
    let req: GetSocialPostsRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let social_posts = db_apis::get_social_posts(pool, req.page_idx, req.page_size)
        .await
        .unwrap();

    let next_idx = if (social_posts.len() as i32) < req.page_size {
        -1
    } else {
        req.page_idx + 1
    };

    let resp = ApiResponse::new_success(GetSocialPostsResponse {
        next_idx,
        social_posts,
    });

    return Ok(resp.into_hyper_response());
}
