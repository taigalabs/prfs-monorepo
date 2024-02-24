use axum::{
    extract::{MatchedPath, Request, State},
    handler::HandlerWithoutStateExt,
    http::{HeaderValue, Method, StatusCode},
    routing::{get, post},
    Json, Router,
};
use prfs_axum_lib::resp::ApiResponse;
use prfs_common_server_state::ServerState;
use prfs_db_interface::shy;
use shy_entities::shy_api::{
    CreateShyPostRequest, CreateShyPostResponse, GetShyPostsRequest, GetShyPostsResponse,
};
use std::{convert::Infallible, sync::Arc};

const LIMIT: i32 = 15;

pub async fn create_shy_post(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<CreateShyPostRequest>,
) -> (StatusCode, Json<ApiResponse<CreateShyPostResponse>>) {
    let state = state.clone();
    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();

    let post_id = shy::insert_shy_post(&mut tx, &input.post).await;

    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(CreateShyPostResponse { post_id });
    return (StatusCode::OK, Json(resp));
}

pub async fn get_shy_posts(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetShyPostsRequest>,
) -> (StatusCode, Json<ApiResponse<GetShyPostsResponse>>) {
    let pool = &state.db2.pool;
    let shy_posts = shy::get_shy_posts(pool, &input.channel_id, input.offset, LIMIT)
        .await
        .unwrap();

    let next_offset = if shy_posts.len() < LIMIT.try_into().unwrap() {
        None
    } else {
        Some(input.offset + LIMIT)
    };

    let resp = ApiResponse::new_success(GetShyPostsResponse {
        shy_posts,
        next_offset,
    });
    return (StatusCode::OK, Json(resp));
}
