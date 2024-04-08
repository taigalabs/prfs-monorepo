use prfs_db_driver::sqlx::{Pool, Postgres, Transaction};
use prfs_db_interface::prfs;
use prfs_entities::atst_api::ComputeCryptoAssetTotalValuesResponse;
use prfs_entities::{ComputeGroupMemberValueResponse, PrfsAtstGroupId};
use prfs_web_fetcher::destinations::coinbase;
use rust_decimal::prelude::FromPrimitive;
use rust_decimal::Decimal;
use std::str::FromStr;

use crate::AtstApiOpsError;

const LIMIT: i32 = 20;

pub async fn compute_group_member_atst_value(
    pool: &Pool<Postgres>,
    mut tx: &mut Transaction<'_, Postgres>,
) -> Result<ComputeGroupMemberValueResponse, AtstApiOpsError> {
    let mut atsts =
        prfs::get_prfs_attestations_by_atst_group_id(&pool, &PrfsAtstGroupId::crypto_1, 0, 50000)
            .await?;

    let mut count = 0;
    for atst in atsts.iter_mut() {
        atst.value_raw = atst.value_num.to_string();
    }

    let _rows_updated = prfs::insert_prfs_attestations(&mut tx, &atsts).await?;

    return Ok(ComputeGroupMemberValueResponse {
        updated_row_count: count,
    });
}
