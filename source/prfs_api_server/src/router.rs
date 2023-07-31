use crate::apis::{prfs_accounts, prfs_circuits, prfs_proof_types, prfs_sets, prfs_tree_nodes};
use crate::middleware;
use crate::state::ServerState;
use crate::ApiServerError;
use hyper::{header, Body, Request, Response};
use routerify::{Middleware, Router};
use routerify_cors::enable_cors_all;
use std::convert::Infallible;
use std::sync::Arc;

const PREFIX: &str = "/api/v0";

pub fn make_router(
    server_state: Arc<ServerState>,
) -> Result<Router<Body, Infallible>, ApiServerError> {
    let r = Router::builder()
        .data(server_state)
        .middleware(Middleware::pre(middleware::logger))
        .middleware(enable_cors_all())
        .get("/", status_handler)
        .post(
            format!("{}/sign_up_prfs_account", PREFIX),
            prfs_accounts::sign_up_prfs_account,
        )
        .post(
            format!("{}/get_prfs_native_circuits", PREFIX),
            prfs_circuits::get_prfs_native_circuits,
        )
        .post(
            format!("{}/sign_in_prfs_account", PREFIX),
            prfs_accounts::sign_in_prfs_account,
        )
        .post(
            format!("{}/get_prfs_tree_nodes", PREFIX),
            prfs_tree_nodes::get_prfs_tree_nodes,
        )
        .post(
            format!("{}/get_prfs_tree_leaf_nodes", PREFIX),
            prfs_tree_nodes::get_prfs_tree_leaf_nodes,
        )
        .post(
            format!("{}/get_prfs_sets", PREFIX),
            prfs_sets::get_prfs_sets,
        )
        .post(
            format!("{}/get_prfs_proof_types", PREFIX),
            prfs_proof_types::get_prfs_proof_types,
        )
        .post(
            format!("{}/insert_prfs_proof_type", PREFIX),
            prfs_proof_types::insert_prfs_proof_types,
        )
        .err_handler_with_info(middleware::error_handler)
        .build()?;

    Ok(r)
}

pub async fn status_handler(_req: Request<Body>) -> Result<Response<Body>, Infallible> {
    println!("status handler!");

    let data = "Ok".to_string();

    let res = Response::builder()
        .header(header::CONTENT_TYPE, "application/json")
        .body(Body::from(data))
        .unwrap();

    Ok(res)
}
