use prfs_atst_api_error_codes::PRFS_ATST_API_ERROR_CODES;
use prfs_axum_lib::axum::{extract::State, http::StatusCode, Json};
use prfs_axum_lib::resp::ApiResponse;
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::PrfsAtstTypeId;
use std::sync::Arc;

use crate::envs::ENVS;

const LIMIT: i32 = 20;

// pub async fn get_prfs_atst_types(
//     State(state): State<Arc<ServerState>>,
//     Json(input): Json<GetCryptoAssetSizeAtstsRequest>,
// ) -> (
//     StatusCode,
//     Json<ApiResponse<GetCryptoAssetSizeAtstsResponse>>,
// ) {
//     let pool = &state.db2.pool;

//     let rows =
//         match prfs::get_prfs_attestations(&pool, &PrfsAtstTypeId::crypto_1, input.offset, LIMIT)
//             .await
//         {
//             Ok(r) => r,
//             Err(err) => {
//                 let resp = ApiResponse::new_error(
//                     &PRFS_ATST_API_ERROR_CODES.UNKNOWN_ERROR,
//                     format!("error getting crypto asset size atsts: {}", err),
//                 );
//                 return (StatusCode::BAD_REQUEST, Json(resp));
//             }
//         };

//     let next_offset = if rows.len() < LIMIT.try_into().unwrap() {
//         None
//     } else {
//         Some(input.offset + LIMIT)
//     };

//     let resp = ApiResponse::new_success(GetCryptoAssetSizeAtstsResponse { rows, next_offset });
//     return (StatusCode::OK, Json(resp));
// }
