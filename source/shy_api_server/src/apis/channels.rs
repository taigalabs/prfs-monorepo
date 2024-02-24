use axum::{
    extract::{Request, State},
    http::StatusCode,
    Json, Router,
};
use hyper::body::Incoming;
use prfs_axum_lib::io::{parse_req, ApiHandlerResult};
use prfs_axum_lib::resp::ApiResponse;
use prfs_common_server_state::ServerState;
use prfs_db_interface::shy;
use shy_entities::shy_api::{
    CreateShyPostRequest, CreateShyPostResponse, GetShyChannelRequest, GetShyChannelResponse,
    GetShyChannelsRequest, GetShyChannelsResponse,
};
use std::sync::Arc;

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

pub async fn get_shy_channels(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetShyChannelsRequest>,
) -> (StatusCode, Json<ApiResponse<GetShyChannelsResponse>>) {
    let pool = &state.db2.pool;
    let rows = shy::get_shy_channels(pool, input.offset, LIMIT)
        .await
        .unwrap();

    let next_offset = if rows.len() < LIMIT.try_into().unwrap() {
        None
    } else {
        Some(input.offset + LIMIT)
    };

    let resp = ApiResponse::new_success(GetShyChannelsResponse { rows, next_offset });
    return (StatusCode::OK, Json(resp));
}

pub async fn get_shy_channel(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetShyChannelRequest>,
) -> (StatusCode, Json<ApiResponse<GetShyChannelResponse>>) {
    let pool = &state.db2.pool;
    let shy_channel = shy::get_shy_channel(pool, &input.channel_id).await.unwrap();

    let resp = ApiResponse::new_success(GetShyChannelResponse { shy_channel });
    return (StatusCode::OK, Json(resp));
}
