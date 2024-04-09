use prfs_db_driver::sqlx::{Pool, Postgres, Transaction};
use prfs_db_interface::prfs;
use prfs_entities::atst_api::ComputeCryptoAssetTotalValuesResponse;
use prfs_entities::{PrfsAtstGroupId, PrfsAtstMeta};
use prfs_web_fetcher::destinations::coinbase;
use rust_decimal::prelude::FromPrimitive;
use rust_decimal::Decimal;
use std::str::FromStr;

use crate::AtstApiOpsError;

const LIMIT: i32 = 20;

pub async fn compute_crypto_asset_total_values(
    mut tx: &mut Transaction<'_, Postgres>,
) -> Result<ComputeCryptoAssetTotalValuesResponse, AtstApiOpsError> {
    let exchange_rates = coinbase::get_exchange_rates("ETH").await?;
    let mut atsts = prfs::get_prfs_attestations_by_atst_group_id__tx(
        &mut tx,
        &PrfsAtstGroupId::crypto_1,
        0,
        50000,
    )
    .await?;

    let denom = Decimal::from_u128(1_000_000_000_000_000_000).unwrap();
    let usd: &str = exchange_rates.data.rates.USD.as_ref();
    let usd = Decimal::from_str(usd).unwrap();

    let mut count = 0;
    for atst in atsts.iter_mut() {
        // let crypto_assets = match state.infura_fetcher.fetch_asset(&input.label).await {
        //     Ok(a) => a.crypto_assets,
        //     Err(err) => {
        //         let resp = ApiResponse::new_error(
        //             &PRFS_ATST_API_ERROR_CODES.FETCH_CRYPTO_ASSET_FAIL,
        //             err.to_string(),
        //         );
        //         return (StatusCode::BAD_REQUEST, Json(resp));
        //     }
        // };
        //
        match &atst.meta.0 {
            PrfsAtstMeta::crypto_asset(meta) => {
                if let Some(a) = meta.assets.get(0) {
                    let val = a.amount * usd / denom;
                    atst.value_num = val;
                    // println!("atst: {:?}", atst);
                    count += 1;
                }
            }
            PrfsAtstMeta::group_member(_) => {}
        }
    }

    let _rows_updated = prfs::insert_prfs_attestations(&mut tx, &atsts).await?;

    return Ok(ComputeCryptoAssetTotalValuesResponse {
        exchange_rates: exchange_rates.data,
        updated_row_count: count,
    });
}
