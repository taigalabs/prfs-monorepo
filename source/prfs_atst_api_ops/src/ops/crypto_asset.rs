use prfs_db_driver::sqlx::types::Json as JsonType;
use prfs_db_driver::sqlx::{Pool, Postgres, Transaction};
use prfs_db_interface::prfs;
use prfs_entities::atst_api::ComputeCryptoAssetTotalValuesResponse;
use prfs_entities::{PrfsAtstGroupId, PrfsAtstMeta, PrfsAtstValue, PrfsSetElementData};
use prfs_web_fetcher::destinations::coinbase;
use prfs_web_fetcher::destinations::infura::InfuraFetcher;
use rust_decimal::prelude::FromPrimitive;
use rust_decimal::Decimal;
use std::str::FromStr;

use crate::AtstApiOpsError;

const LIMIT: i32 = 20;

pub async fn compute_crypto_asset_total_values(
    mut tx: &mut Transaction<'_, Postgres>,
    infura_fetcher: &InfuraFetcher,
) -> Result<ComputeCryptoAssetTotalValuesResponse, AtstApiOpsError> {
    let exchange_rates = coinbase::get_exchange_rates("ETH").await?;
    let mut atsts = prfs::get_prfs_attestations_by_atst_group_id__tx(
        &mut tx,
        &PrfsAtstGroupId::crypto_1,
        0,
        50000,
    )
    .await?;

    let denom = Decimal::from_u128(1_000_000_000_000_000_000)
        .ok_or_else(|| format!("Couldn't initialize decimal"))?;

    let usd = Decimal::from_str(&exchange_rates.data.rates.USD)?;
    let cent_ratio =
        Decimal::from_u32(100).ok_or_else(|| format!("Couldn't initialize decimal"))?;

    let mut count = 0;
    for atst in atsts.iter_mut() {
        match &mut atst.meta.0 {
            PrfsAtstMeta::crypto_asset(ref mut meta) => {
                if let Some(a) = meta.assets.get(0) {
                    let val = a.amount * usd / denom * cent_ratio;
                    let val = val.floor();

                    atst.value = JsonType(vec![PrfsAtstValue {
                        label: "total value".to_string(),
                        value_raw: val.to_string(),
                        value_int: val.to_string(),
                        meta: Some(format!("{} USc", a.amount.to_string())),
                    }]);
                    count += 1;
                }
            }
            _ => {}
        }
    }

    let _rows_updated = prfs::upsert_prfs_attestations(&mut tx, &atsts).await?;

    return Ok(ComputeCryptoAssetTotalValuesResponse {
        exchange_rates: exchange_rates.data,
        updated_row_count: count,
    });
}
