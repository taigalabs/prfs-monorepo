use prfs_db_driver::sqlx::{self, Pool, Postgres, QueryBuilder, Row, Transaction};
use prfs_entities::entities::PrfsPollResponse;
use prfs_entities::prfs_api::SubmitPrfsPollResponseRequest;
use uuid::Uuid;

use crate::DbInterfaceError;

pub async fn get_prfs_poll_responses_by_poll_id(
    pool: &Pool<Postgres>,
    poll_id: &Uuid,
) -> Result<Vec<PrfsPollResponse>, DbInterfaceError> {
    let query = r#"
SELECT * 
FROM prfs_poll_responses
WHERE poll_id=$1
"#;

    let rows = sqlx::query(query).bind(poll_id).fetch_all(pool).await?;

    let prfs_polls = rows
        .iter()
        .map(|row| {
            Ok(PrfsPollResponse {
                poll_id: row.try_get("poll_id")?,
                value: row.try_get("value")?,
                proof_instance_id: row.try_get("proof_instance_id")?,
                serial_no: row.try_get("serial_no")?,
            })
        })
        .collect::<Result<Vec<PrfsPollResponse>, DbInterfaceError>>()?;

    return Ok(prfs_polls);
}

pub async fn insert_prfs_poll_response(
    tx: &mut Transaction<'_, Postgres>,
    submit_poll_response_req: &SubmitPrfsPollResponseRequest,
) -> Result<Uuid, DbInterfaceError> {
    let query = r#"
INSERT INTO prfs_poll_responses
(poll_id, value, proof_instance_id, serial_no)
VALUES ($1, $2, $3, $4)
RETURNING poll_id"#;

    let row = sqlx::query(query)
        .bind(&submit_poll_response_req.poll_id)
        .bind(&submit_poll_response_req.value)
        .bind(&submit_poll_response_req.proof_instance_id)
        .bind(&submit_poll_response_req.serial_no)
        .fetch_one(&mut **tx)
        .await?;

    let poll_id: Uuid = row.try_get("poll_id")?;

    return Ok(poll_id);
}
