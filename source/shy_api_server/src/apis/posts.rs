use ethers_signers::Signer;
use hyper::body::Incoming;
use hyper::{Request, Response};
use hyper_utils::io::{parse_req, ApiHandlerResult, BytesBoxBody};
use hyper_utils::resp::ApiResponse;
use prfs_common_server_state::ServerState;
use prfs_db_interface::shy;
use prfs_entities::shy_api_entities::{
    CreateShyPostRequest, CreateShyPostResponse, GetShyPostsRequest, GetShyPostsResponse,
};
use std::{convert::Infallible, sync::Arc};
use uuid::Uuid;

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
    let social_posts = shy::get_shy_posts(pool, req.page_idx, req.page_size)
        .await
        .unwrap();

    let next_idx = if (social_posts.len() as i32) < req.page_size {
        -1
    } else {
        req.page_idx + 1
    };

    let resp = ApiResponse::new_success(GetShyPostsResponse {
        next_idx,
        social_posts,
    });

    return Ok(resp.into_hyper_response());
}
