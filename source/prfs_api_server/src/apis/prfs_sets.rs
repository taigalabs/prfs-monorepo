use hyper::{body, Body, Request, Response};
use prfs_db_interface::db_apis;
use prfs_entities::{
    apis_entities::{
        ComputePrfsSetMerkleRootRequest, ComputePrfsSetMerkleRootResponse,
        CreatePrfsDynamicSetElementRequest, CreatePrfsDynamicSetElementResponse,
        CreatePrfsSetRequest, CreatePrfsSetResponse, GetPrfsSetBySetIdRequest,
        GetPrfsSetBySetIdResponse, GetPrfsSetsBySetTypeRequest, GetPrfsSetsRequest,
        GetPrfsSetsResponse, UpdatePrfsTreeNodeRequest,
    },
    entities::PrfsTreeNode,
};
use prfs_tree_maker::tree_maker_apis;
use routerify::prelude::*;
use rust_decimal::Decimal;
use std::{convert::Infallible, sync::Arc};

use crate::{
    responses::ApiResponse,
    server::{request::parse_req, state::ServerState},
    ApiServerError,
};

pub async fn get_prfs_sets(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap().clone();
    let req: GetPrfsSetsRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let prfs_sets = db_apis::get_prfs_sets(pool, req.page_idx, req.page_size)
        .await
        .unwrap();

    let resp = ApiResponse::new_success(GetPrfsSetsResponse {
        page_idx: req.page_idx,
        page_size: req.page_size,
        prfs_sets,
    });

    return Ok(resp.into_hyper_response());
}

pub async fn get_prfs_sets_by_set_type(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap().clone();
    let req: GetPrfsSetsBySetTypeRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let prfs_sets =
        db_apis::get_prfs_sets_by_set_type(pool, req.set_type, req.page_idx, req.page_size)
            .await
            .unwrap();

    let resp = ApiResponse::new_success(GetPrfsSetsResponse {
        page_idx: req.page_idx,
        page_size: req.page_size,
        prfs_sets,
    });

    return Ok(resp.into_hyper_response());
}

pub async fn get_prfs_set_by_set_id(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap().clone();
    let req: GetPrfsSetBySetIdRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let prfs_set = db_apis::get_prfs_set_by_set_id(pool, &req.set_id)
        .await
        .unwrap();

    let resp = ApiResponse::new_success(GetPrfsSetBySetIdResponse { prfs_set });

    return Ok(resp.into_hyper_response());
}

pub async fn create_prfs_set(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap().clone();
    let req: CreatePrfsSetRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();

    let set_id = db_apis::insert_prfs_set_ins1(&mut tx, &req.prfs_set_ins1)
        .await
        .unwrap();

    let resp = ApiResponse::new_success(CreatePrfsSetResponse { set_id });

    tx.commit().await.unwrap();

    return Ok(resp.into_hyper_response());
}

pub async fn create_prfs_dynamic_set_element(
    req: Request<Body>,
) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap().clone();
    let req: CreatePrfsDynamicSetElementRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();

    let largest_pos_w = db_apis::get_largest_pos_w_tree_leaf_node(&pool, &req.set_id)
        .await
        .unwrap();

    let pos_w = if let Some(pos_w) = largest_pos_w {
        pos_w + Decimal::from(1)
    } else {
        Decimal::from(0)
    };

    let node = PrfsTreeNode {
        pos_w,
        pos_h: 0,
        val: req.val.to_string(),
        meta: Some(req.meta),
        set_id: req.set_id,
    };

    let pos_w = db_apis::insert_prfs_tree_node(&mut tx, &node)
        .await
        .unwrap();

    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(CreatePrfsDynamicSetElementResponse { pos_w });

    return Ok(resp.into_hyper_response());
}

pub async fn compute_prfs_set_merkle_root(
    req: Request<Body>,
) -> Result<Response<Body>, Infallible> {
    let state = req.data::<Arc<ServerState>>().unwrap().clone();

    let req: ComputePrfsSetMerkleRootRequest = parse_req(req).await;

    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();

    let mut prfs_set = db_apis::get_prfs_set_by_set_id(pool, &req.set_id)
        .await
        .unwrap();

    let leaf_nodes = db_apis::get_prfs_tree_leaf_nodes_all_by_set_id(pool, &req.set_id)
        .await
        .unwrap();

    let merkle_root = tree_maker_apis::create_tree_nodes(&mut tx, &mut prfs_set, &leaf_nodes)
        .await
        .unwrap();

    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(ComputePrfsSetMerkleRootResponse {
        set_id: req.set_id,
        merkle_root,
    });

    return Ok(resp.into_hyper_response());
}
