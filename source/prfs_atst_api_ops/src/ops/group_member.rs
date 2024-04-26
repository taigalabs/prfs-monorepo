use prfs_crypto::convert_str_into_keccak_u256;
use prfs_db_driver::sqlx::types::Json as JsonType;
use prfs_db_driver::sqlx::{Postgres, Transaction};
use prfs_db_interface::prfs;
use prfs_entities::{
    ComputeGroupMemberValueResponse, PrfsAtstGroupId, PrfsAtstMeta, PrfsAtstValue,
};

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

    for atst in atsts.iter_mut() {
        if let PrfsAtstMeta::plain_data(d) = &atst.meta.0 {
            for value in &d.values {
                let u = convert_str_into_keccak_u256(&value.value_raw);
                atst.value = JsonType(vec![PrfsAtstValue {
                    label: "member default value".to_string(),
                    value_raw: value.value_raw.to_string(),
                    value_int: u.to_string(),
                    meta: None,
                }]);
            }
        }
    }

    let rows_updated = prfs::upsert_prfs_attestations(&mut tx, &atsts).await?;

    return Ok(ComputeGroupMemberValueResponse {
        updated_row_count: rows_updated.try_into()?,
    });
}
