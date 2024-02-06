use http_body_util::{BodyExt, Full};
use hyper::body::{Bytes, Incoming};
use hyper::{header, Method, Request, Response};
use hyper_utils::cors::handle_cors;
use hyper_utils::io::{full, BytesBoxBody};
use hyper_utils::resp::ApiResponse;
use prfs_atst_server::server::router::{atst_server_routes, ATST_API};
use prfs_common_server_state::ServerState;
use prfs_id_server::server::router::id_server_routes;
use prfs_id_server::server::ID_API;
use prfs_id_session_server::server::{id_session_server_routes, ID_SESSION_API};
use shy_api_server::server::router::{shy_server_routes, SHY_API};
use std::convert::Infallible;
use std::sync::Arc;

use super::middleware::{handle_not_found, log};
use crate::apis::status::handle_server_status;
use crate::apis::{
    prfs_accounts, prfs_circuit_drivers, prfs_circuit_types, prfs_circuits, prfs_indices,
    prfs_polls, prfs_proof_instances, prfs_proof_types, prfs_set_elements, prfs_sets,
    prfs_tree_nodes,
};
use crate::ApiServerError;

macro_rules! v0_path {
    ($path: tt) => {
        concat!("/api/v0/", $path)
    };
}

pub async fn route(req: Request<Incoming>, state: Arc<ServerState>) -> Response<BytesBoxBody> {
    log(&req);

    let p = req.uri().path();

    // if req.uri().path() == "/a" {
    //     return handle_request(req).await.unwrap();
    // }

    let resp = if p.starts_with(ID_API) {
        id_server_routes(req, state).await
    } else if p.starts_with(ATST_API) {
        atst_server_routes(req, state).await
    } else if p.starts_with(SHY_API) {
        shy_server_routes(req, state).await
    } else if p.starts_with(ID_SESSION_API) {
        id_session_server_routes(req, state).await
    } else {
        match (req.method(), req.uri().path()) {
            (&Method::OPTIONS, _) => handle_cors(),
            (&Method::GET, "/") => handle_server_status(req, state).await,
            (&Method::POST, v0_path!("sign_up_prfs_account")) => {
                prfs_accounts::sign_up_prfs_account(req, state).await
            }
            (&Method::POST, v0_path!("sign_in_prfs_account")) => {
                prfs_accounts::sign_in_prfs_account(req, state).await
            }
            (&Method::POST, v0_path!("get_prfs_circuits")) => {
                prfs_circuits::get_prfs_circuits(req, state).await
            }
            (&Method::POST, v0_path!("get_prfs_circuit_by_circuit_id")) => {
                prfs_circuits::get_prfs_circuit_by_circuit_id(req, state).await
            }
            (&Method::POST, v0_path!("get_prfs_circuit_types")) => {
                prfs_circuit_types::get_prfs_circuit_types(req, state).await
            }
            (&Method::POST, v0_path!("get_prfs_circuit_type_by_circuit_type_id")) => {
                prfs_circuit_types::get_prfs_circuit_type_by_circuit_type_id(req, state).await
            }
            (&Method::POST, v0_path!("get_prfs_circuit_drivers")) => {
                prfs_circuit_drivers::get_prfs_circuit_drivers(req, state).await
            }
            (&Method::POST, v0_path!("get_prfs_circuit_driver_by_driver_id")) => {
                prfs_circuit_drivers::get_prfs_circuit_driver_by_driver_id(req, state).await
            }
            (&Method::POST, v0_path!("create_prfs_proof_instance")) => {
                prfs_proof_instances::create_prfs_proof_instance(req, state).await
            }
            (&Method::POST, v0_path!("get_prfs_proof_instances")) => {
                prfs_proof_instances::get_prfs_proof_instances(req, state).await
            }
            (&Method::POST, v0_path!("get_prfs_proof_instance_by_instance_id")) => {
                prfs_proof_instances::get_prfs_proof_instance_by_instance_id(req, state).await
            }
            (&Method::POST, v0_path!("get_prfs_proof_instance_by_short_id")) => {
                prfs_proof_instances::get_prfs_proof_instance_by_short_id(req, state).await
            }
            (&Method::POST, v0_path!("get_prfs_set_elements")) => {
                prfs_set_elements::get_prfs_set_elements(req, state).await
            }
            (&Method::POST, v0_path!("get_prfs_set_element")) => {
                prfs_set_elements::get_prfs_set_element(req, state).await
            }
            (&Method::POST, v0_path!("create_prfs_dynamic_set_element")) => {
                prfs_sets::create_prfs_dynamic_set_element(req, state).await
            }
            (&Method::POST, v0_path!("get_prfs_tree_nodes_by_pos")) => {
                prfs_tree_nodes::get_prfs_tree_nodes_by_pos(req, state).await
            }
            (&Method::POST, v0_path!("get_prfs_tree_leaf_nodes_by_set_id")) => {
                prfs_tree_nodes::get_prfs_tree_leaf_nodes_by_set_id(req, state).await
            }
            (&Method::POST, v0_path!("get_prfs_tree_leaf_indices")) => {
                prfs_tree_nodes::get_prfs_tree_leaf_indices(req, state).await
            }
            (&Method::POST, v0_path!("create_prfs_set")) => {
                prfs_sets::create_prfs_set(req, state).await
            }
            (&Method::POST, v0_path!("get_prfs_sets")) => {
                prfs_sets::get_prfs_sets(req, state).await
            }
            (&Method::POST, v0_path!("get_prfs_sets_by_set_type")) => {
                prfs_sets::get_prfs_sets_by_set_type(req, state).await
            }
            (&Method::POST, v0_path!("get_prfs_set_by_set_id")) => {
                prfs_sets::get_prfs_set_by_set_id(req, state).await
            }
            (&Method::POST, v0_path!("get_prfs_proof_types")) => {
                prfs_proof_types::get_prfs_proof_types(req, state).await
            }
            (&Method::POST, v0_path!("get_prfs_proof_type_by_proof_type_id")) => {
                prfs_proof_types::get_prfs_proof_type_by_proof_type_id(req, state).await
            }
            (&Method::POST, v0_path!("create_prfs_proof_type")) => {
                prfs_proof_types::create_prfs_proof_type(req, state).await
            }
            (&Method::POST, v0_path!("update_prfs_tree_node")) => {
                prfs_tree_nodes::update_prfs_tree_node(req, state).await
            }
            (&Method::POST, v0_path!("compute_prfs_set_merkle_root")) => {
                prfs_sets::compute_prfs_set_merkle_root(req, state).await
            }
            (&Method::POST, v0_path!("get_prfs_polls")) => {
                prfs_polls::get_prfs_polls(req, state).await
            }
            (&Method::POST, v0_path!("get_prfs_poll_by_poll_id")) => {
                prfs_polls::get_prfs_poll_by_poll_id(req, state).await
            }
            (&Method::POST, v0_path!("get_prfs_poll_result_by_poll_id")) => {
                prfs_polls::get_prfs_poll_result_by_poll_id(req, state).await
            }
            (&Method::POST, v0_path!("submit_prfs_poll_response")) => {
                prfs_polls::submit_prfs_poll_response(req, state).await
            }
            (&Method::POST, v0_path!("create_prfs_poll")) => {
                prfs_polls::create_prfs_poll(req, state).await
            }
            (&Method::POST, v0_path!("import_prfs_set_elements")) => {
                prfs_set_elements::import_prfs_set_elements(req, state).await
            }
            (&Method::POST, v0_path!("create_tree_of_prfs_set")) => {
                prfs_sets::create_tree_of_prfs_set(req, state).await
            }
            (&Method::POST, v0_path!("get_least_recent_prfs_index")) => {
                prfs_indices::get_least_recent_index(req, state).await
            }
            (&Method::POST, v0_path!("get_prfs_indices")) => {
                prfs_indices::get_prfs_indices(req, state).await
            }
            (&Method::POST, v0_path!("add_prfs_index")) => {
                prfs_indices::add_prfs_index(req, state).await
            }
            _ => handle_not_found(req, state).await,
        }
    };

    // Inline const is not availble at the moment
    // https://github.com/rodrimati1992/const_format_crates/issues/17
    match resp {
        Ok(r) => return r,
        Err(err) => return ApiResponse::new_error(err).into_hyper_response(),
    }
}

// pub fn upgrade<B>(
//     mut request: impl std::borrow::BorrowMut<Request<B>>,
//     config: Option<WebSocketConfig>,
// ) -> Result<(Response<Full<Bytes>>, HyperWebsocket), ProtocolError> {
//     let request = request.borrow_mut();

//     let key = request
//         .headers()
//         .get("Sec-WebSocket-Key")
//         .ok_or(ProtocolError::MissingSecWebSocketKey)?;
//     if request
//         .headers()
//         .get("Sec-WebSocket-Version")
//         .map(|v| v.as_bytes())
//         != Some(b"13")
//     {
//         return Err(ProtocolError::MissingSecWebSocketVersionHeader);
//     }

//     let response = Response::builder()
//         .status(hyper::StatusCode::SWITCHING_PROTOCOLS)
//         .header(hyper::header::CONNECTION, "upgrade")
//         .header(hyper::header::UPGRADE, "websocket")
//         .header("Sec-WebSocket-Accept", &derive_accept_key(key.as_bytes()))
//         .body(Full::<Bytes>::from("switching to websocket protocol"))
//         .expect("bug: failed to build response");

//     let stream = HyperWebsocket {
//         inner: hyper::upgrade::on(request),
//         config,
//     };

//     Ok((response, stream))
// }
