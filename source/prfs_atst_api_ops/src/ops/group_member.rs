use prfs_crypto::ff::PrimeField;
use prfs_crypto::hex;
use prfs_crypto::hexutils;
use prfs_crypto::k256::Scalar;
use prfs_db_driver::sqlx::{Pool, Postgres, Transaction};
use prfs_db_interface::prfs;
use prfs_entities::atst_api::ComputeCryptoAssetTotalValuesResponse;
use prfs_entities::{
    ComputeGroupMemberValueResponse, GroupMemberAtstMeta, PrfsAtstGroupId, PrfsAtstMeta,
};
use prfs_web3_rs::ethers_core::utils::keccak256;
use prfs_web_fetcher::destinations::coinbase;
use rust_decimal::Decimal;

use crate::AtstApiOpsError;

const LIMIT: i32 = 20;

pub async fn compute_group_member_atst_value(
    mut tx: &mut Transaction<'_, Postgres>,
) -> Result<ComputeGroupMemberValueResponse, AtstApiOpsError> {
    let mut atsts = prfs::get_prfs_attestations_by_atst_group_id__tx(
        &mut tx,
        &PrfsAtstGroupId::crypto_1,
        0,
        50000,
    )
    .await?;

    // let mut count = 0;
    for atst in atsts.iter_mut() {
        if let PrfsAtstMeta::group_member(m) = &atst.meta.0 {
            let bytes = m.value_raw.as_bytes();
            let hx = hex::encode(bytes);
            let num = Decimal::from_str_radix(&hx, 16)?;

            // Scalar::from_str_vartime(s)
            // Scalar::from_str_vartime(bytes);
            // let h = keccak256(bytes);
            // let hashed = hex::encode(h);

            atst.value_num = num;
            atst.value_raw = m.value_raw.to_string();
        }
    }

    let rows_updated = prfs::insert_prfs_attestations(&mut tx, &atsts).await?;

    return Ok(ComputeGroupMemberValueResponse {
        updated_row_count: rows_updated.try_into()?,
    });
}
