use ethers_signers::Signer;
use hyper::body::Incoming;
use hyper::{Request, Response};
use hyper_utils::io::{parse_req, ApiHandlerResult, BytesBoxBody};
use hyper_utils::resp::ApiResponse;
use prfs_common_server_state::ServerState;
use prfs_db_interface::shy;
use prfs_entities::shy_api_entities::{
    CreateShyPostRequest, CreateShyPostResponse, GetShyChannelsResponse, GetShyPostsRequest,
    GetShyPostsResponse,
};
use std::{convert::Infallible, sync::Arc};
use uuid::Uuid;

const LIMIT: i32 = 15;

pub async fn create_shy_post(req: Request<Incoming>, state: Arc<ServerState>) -> ApiHandlerResult {
    let state = state.clone();
    let req: CreateShyPostRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();

    let post_id = shy::insert_shy_post(&mut tx, &req.post).await;

    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(CreateShyPostResponse { post_id });

    return Ok(resp.into_hyper_response());
}

pub async fn get_shy_channels(req: Request<Incoming>, state: Arc<ServerState>) -> ApiHandlerResult {
    let req: GetShyPostsRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let shy_channels = shy::get_shy_channels(pool, req.offset, LIMIT)
        .await
        .unwrap();

    let next_offset = if shy_posts.len() < LIMIT.try_into().unwrap() {
        None
    } else {
        Some(req.offset + LIMIT)
    };

    let resp = ApiResponse::new_success(GetShyChannelsResponse {
        shy_channels,
        next_offset,
    });

    return Ok(resp.into_hyper_response());
}
