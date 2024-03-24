use prfs_admin::mock::MASTER_ACCOUNT_IDS;
use prfs_api_rs::api::update_prfs_tree_by_new_atst;
use prfs_atst_api_error_codes::PRFS_ATST_API_ERROR_CODES;
use prfs_axum_lib::axum::{extract::State, http::StatusCode, Json};
use prfs_axum_lib::resp::ApiResponse;
use prfs_axum_lib::ApiHandleError;
use prfs_common_server_state::ServerState;
use prfs_db_driver::sqlx::types::Json as JsonType;
use prfs_db_interface::prfs;
use prfs_entities::atst_api::{
    ComputeCryptoAssetSizeTotalValuesRequest, ComputeCryptoAssetSizeTotalValuesResponse,
    CreateCryptoAssetSizeAtstRequest, CreateCryptoAssetSizeAtstResponse, FetchCryptoAssetRequest,
    FetchCryptoAssetResponse, GetCryptoAssetSizeAtstRequest, GetCryptoAssetSizeAtstResponse,
    GetCryptoAssetSizeAtstsRequest, GetCryptoAssetSizeAtstsResponse,
};
use prfs_entities::atst_entities::{PrfsAtstStatus, PrfsAttestation};
use prfs_entities::{PrfsAtstType, UpdatePrfsTreeByNewAtstRequest, UpdatePrfsTreeNodeRequest};
use prfs_web3_rs::signature::verify_eth_sig_by_addr;
use prfs_web_fetcher::destinations::coinbase::{self};
use rust_decimal::prelude::FromPrimitive;
use rust_decimal::Decimal;
use std::str::FromStr;
use std::sync::Arc;

use prfs_db_driver::sqlx::{Pool, Postgres, Transaction};

use crate::envs::ENVS;
use crate::AtstApiOpsError;

const LIMIT: i32 = 20;

pub async fn compute_crypto_asset_size_total_values(
    pool: &Pool<Postgres>,
    mut tx: &mut Transaction<'_, Postgres>,
) -> Result<ComputeCryptoAssetSizeTotalValuesResponse, AtstApiOpsError> {
    let exchange_rates = coinbase::get_exchange_rates("ETH").await?;
    let mut atsts = prfs::get_prfs_attestations(&pool, &PrfsAtstType::crypto_1, 0, 50000).await?;

    let denom = Decimal::from_u128(1_000_000_000_000_000_000).unwrap();
    let usd: &str = exchange_rates.data.rates.USD.as_ref();
    let usd = Decimal::from_str(usd).unwrap();

    let mut count = 0;
    for atst in atsts.iter_mut() {
        if let Some(c) = atst.meta.get(0) {
            let v = c.amount * usd / denom;
            atst.value = Decimal::from(10);
            println!("atst: {:?}", atst);

            count += 1;
        }
    }

    let rows_updated = prfs::insert_prfs_attestations(&mut tx, &atsts).await?;
    println!("rows_updated: {}", rows_updated);

    return Ok(ComputeCryptoAssetSizeTotalValuesResponse {
        exchange_rates: exchange_rates.data,
        updated_row_count: count,
    });
}
