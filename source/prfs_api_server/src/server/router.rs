use crate::apis::prfs_accounts::sign_up_prfs_account;
use crate::apis::status::handle_server_status;
use crate::apis::{
    prfs_accounts, prfs_circuit_drivers, prfs_circuit_types, prfs_circuits, prfs_polls,
    prfs_proof_instances, prfs_proof_types, prfs_sets, prfs_tree_nodes, social_posts,
};
use crate::ApiServerError;
use hyper::body::Incoming;
use hyper::service::service_fn;
use hyper::{header, Method, Request, Response, StatusCode};
use hyper_utils::cors::handle_cors;
use std::pin::Pin;
// use routerify::prelude::RequestExt;
// use routerify::{Middleware, Router};
// use routerify_cors::enable_cors_all;
use const_format::concatcp;
use hyper_utils::io::{empty, full, BytesBoxBody};
use matchit::Router;
use std::collections::HashMap;
use std::convert::Infallible;
use std::future::Future;
use std::sync::Arc;
use tokio::sync::Mutex;
use tower::util::BoxCloneService;

use super::middleware;
use super::state::ServerState;

// const PREFIX: &str = "/api/v0";

macro_rules! v0_path {
    ($path: tt) => {
        concat!("/api/v0/", $path)
    };
}

// type Service = Mutex<BoxCloneService<Request<Incoming>, Response<BytesBoxBody>, hyper::Error>>;
type RouterMap = HashMap<Method, matchit::Router<Handler<BytesBoxBody, ApiServerError>>>;
type Handler<B, E> = Box<dyn Fn(Request<Incoming>) -> HandlerReturn<B, E> + Send + Sync + 'static>;
type HandlerReturn<B, E> = Box<dyn Future<Output = Result<Response<B>, E>> + Send + 'static>;

async fn index(_req: Request<Incoming>) -> Result<Response<BytesBoxBody>, ApiServerError> {
    Ok(Response::new(full("Hello, world!")))
}

// async fn not_found(_req: Request<Body>) -> hyper::Result<Response<Body>> {
//     Ok(Response::builder().status(404).body(Body::empty()).unwrap())
// }

pub fn box_service<H, R>(
    handler: H,
    server_state: Arc<ServerState>,
) -> Handler<BytesBoxBody, ApiServerError>
where
    H: Fn(Request<Incoming>, Arc<ServerState>) -> R + Send + Sync + 'static,
    R: Future<Output = Result<Response<BytesBoxBody>, ApiServerError>> + Send + 'static,
{
    let h: Handler<_, _> = Box::new(move |req: Request<Incoming>| {
        Box::new(handle_server_status(req, server_state.clone()))
    });
    h
}

pub async fn route(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> Result<Response<BytesBoxBody>, ApiServerError> {
    // Inline const is not availble at the moment
    // https://github.com/rodrimati1992/const_format_crates/issues/17
    // match_route!(req, "/api/v0");

    return match (req.method(), req.uri().path()) {
        (&Method::OPTIONS, _) => handle_cors(),
        (&Method::GET, "/") => handle_server_status(req, state).await,
        (&Method::POST, v0_path!("sign_up_prfs_account")) => sign_up_prfs_account(req, state).await,
        // (&Method::POST, v0_path!("sign_up_prfs_account")) => Ok(Response::new(full(""))),

        //             format!("{}/get_prfs_circuits", PREFIX),
        //             prfs_circuits::get_prfs_circuits,
        _ => Ok(Response::builder()
            .status(StatusCode::NOT_FOUND)
            .body(full(""))
            .unwrap()),
    };
}

// pub fn make_router(
//     server_state: Arc<ServerState>,
// ) -> Result<Router<Body, Infallible>, ApiServerError> {
//     let r = Router::builder()
//         .data(server_state)
//         .middleware(Middleware::pre(middleware::logger))
//         .middleware(enable_cors_all())
//         .get("/", status_handler)
//         .post(
//             format!("{}/sign_up_prfs_account", PREFIX),
//             prfs_accounts::sign_up_prfs_account,
//         )
//         .post(
//             format!("{}/get_prfs_circuits", PREFIX),
//             prfs_circuits::get_prfs_circuits,
//         )
//         .post(
//             format!("{}/get_prfs_circuit_by_circuit_id", PREFIX),
//             prfs_circuits::get_prfs_circuit_by_circuit_id,
//         )
//         .post(
//             format!("{}/get_prfs_circuit_types", PREFIX),
//             prfs_circuit_types::get_prfs_circuit_types,
//         )
//         .post(
//             format!("{}/get_prfs_circuit_type_by_circuit_type_id", PREFIX),
//             prfs_circuit_types::get_prfs_circuit_type_by_circuit_type_id,
//         )
//         .post(
//             format!("{}/get_prfs_circuit_drivers", PREFIX),
//             prfs_circuit_drivers::get_prfs_circuit_drivers,
//         )
//         .post(
//             format!("{}/get_prfs_circuit_driver_by_driver_id", PREFIX),
//             prfs_circuit_drivers::get_prfs_circuit_driver_by_driver_id,
//         )
//         .post(
//             format!("{}/create_prfs_proof_instance", PREFIX),
//             prfs_proof_instances::create_prfs_proof_instance,
//         )
//         .post(
//             format!("{}/get_prfs_proof_instances", PREFIX),
//             prfs_proof_instances::get_prfs_proof_instances,
//         )
//         .post(
//             format!("{}/get_prfs_proof_instance_by_instance_id", PREFIX),
//             prfs_proof_instances::get_prfs_proof_instance_by_instance_id,
//         )
//         .post(
//             format!("{}/get_prfs_proof_instance_by_short_id", PREFIX),
//             prfs_proof_instances::get_prfs_proof_instance_by_short_id,
//         )
//         .post(
//             format!("{}/sign_in_prfs_account", PREFIX),
//             prfs_accounts::sign_in_prfs_account,
//         )
//         .post(
//             format!("{}/get_prfs_set_elements", PREFIX),
//             prfs_tree_nodes::get_prfs_tree_nodes_by_pos,
//         )
//         .post(
//             format!("{}/create_prfs_dynamic_set_element", PREFIX),
//             prfs_sets::create_prfs_dynamic_set_element,
//         )
//         .post(
//             format!("{}/get_prfs_tree_nodes_by_pos", PREFIX),
//             prfs_tree_nodes::get_prfs_tree_nodes_by_pos,
//         )
//         .post(
//             format!("{}/get_prfs_tree_leaf_nodes_by_set_id", PREFIX),
//             prfs_tree_nodes::get_prfs_tree_leaf_nodes_by_set_id,
//         )
//         .post(
//             format!("{}/get_prfs_tree_leaf_indices", PREFIX),
//             prfs_tree_nodes::get_prfs_tree_leaf_indices,
//         )
//         .post(
//             format!("{}/create_prfs_set", PREFIX),
//             prfs_sets::create_prfs_set,
//         )
//         .post(
//             format!("{}/get_prfs_sets", PREFIX),
//             prfs_sets::get_prfs_sets,
//         )
//         .post(
//             format!("{}/get_prfs_sets_by_set_type", PREFIX),
//             prfs_sets::get_prfs_sets_by_set_type,
//         )
//         .post(
//             format!("{}/get_prfs_set_by_set_id", PREFIX),
//             prfs_sets::get_prfs_set_by_set_id,
//         )
//         .post(
//             format!("{}/get_prfs_proof_types", PREFIX),
//             prfs_proof_types::get_prfs_proof_types,
//         )
//         .post(
//             format!("{}/get_prfs_proof_type_by_proof_type_id", PREFIX),
//             prfs_proof_types::get_prfs_proof_type_by_proof_type_id,
//         )
//         .post(
//             format!("{}/create_prfs_proof_type", PREFIX),
//             prfs_proof_types::create_prfs_proof_type,
//         )
//         .post(
//             format!("{}/update_prfs_tree_node", PREFIX),
//             prfs_tree_nodes::update_prfs_tree_node,
//         )
//         .post(
//             format!("{}/compute_prfs_set_merkle_root", PREFIX),
//             prfs_sets::compute_prfs_set_merkle_root,
//         )
//         .post(
//             format!("{}/get_prfs_polls", PREFIX),
//             prfs_polls::get_prfs_polls,
//         )
//         .post(
//             format!("{}/get_prfs_poll_by_poll_id", PREFIX),
//             prfs_polls::get_prfs_poll_by_poll_id,
//         )
//         .post(
//             format!("{}/get_prfs_poll_result_by_poll_id", PREFIX),
//             prfs_polls::get_prfs_poll_result_by_poll_id,
//         )
//         .post(
//             format!("{}/submit_prfs_poll_response", PREFIX),
//             prfs_polls::submit_prfs_poll_response,
//         )
//         .post(
//             format!("{}/create_prfs_poll", PREFIX),
//             prfs_polls::create_prfs_poll,
//         )
//         .post(
//             format!("{}/create_social_post", PREFIX),
//             social_posts::create_social_post,
//         )
//         .post(
//             format!("{}/get_social_posts", PREFIX),
//             social_posts::get_social_posts,
//         )
//         .post("*", middleware::not_found_handler)
//         .err_handler_with_info(middleware::error_handler)
//         .build()?;

//     Ok(r)
// }
