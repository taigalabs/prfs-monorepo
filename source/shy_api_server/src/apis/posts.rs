use ethers_signers::Signer;
use hyper::body::Incoming;
use hyper::{Request, Response};
use prfs_axum_lib::io::{parse_req, ApiHandlerResult, BytesBoxBody};
use prfs_axum_lib::resp::ApiResponse;
use prfs_common_server_state::ServerState;
use prfs_db_interface::shy;
use prfs_entities::shy_api::{
    CreateShyPostRequest, CreateShyPostResponse, GetShyPostsRequest, GetShyPostsResponse,
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

pub async fn get_shy_posts(req: Request<Incoming>, state: Arc<ServerState>) -> ApiHandlerResult {
    let req: GetShyPostsRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let shy_posts = shy::get_shy_posts(pool, req.offset, LIMIT).await.unwrap();

    let next_offset = if shy_posts.len() < LIMIT.try_into().unwrap() {
        None
    } else {
        Some(req.offset + LIMIT)
    };

    let resp = ApiResponse::new_success(GetShyPostsResponse {
        shy_posts,
        next_offset,
    });

    return Ok(resp.into_hyper_response());
}
