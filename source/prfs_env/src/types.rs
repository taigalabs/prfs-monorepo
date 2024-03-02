use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct PrfsEnv {
    pub taigalabs_website: String,
    pub prfs_code_repository: String,
    pub prfs_id_webapp: String,
    pub prfs_console_webapp: String,
    pub prfs_proof_webapp: String,
    pub prfs_poll_webapp: String,
    pub prfs_docs_website: String,
    pub prfs_api_server: String,
    pub prfs_asset_server: String,
    pub prfs_id_session_server_socket: String,
    pub shy_webapp: String,
    pub shy_docs_website: String,
}
