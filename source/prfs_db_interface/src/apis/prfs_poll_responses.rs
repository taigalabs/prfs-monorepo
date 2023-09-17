use crate::DbInterfaceError;
use prfs_entities::apis_entities::{CreatePrfsPollRequest, SubmitPrfsPollResponseRequest};
use prfs_entities::entities::{PrfsAccount, PrfsPolicyItem, PrfsPoll, PrfsPollResponse};
use prfs_entities::sqlx::{self, Pool, Postgres, Row, Transaction};
use uuid::Uuid;

pub async fn get_prfs_poll_responses_by_poll_id(
    pool: &Pool<Postgres>,
    poll_id: &Uuid,
) -> Result<Vec<PrfsPollResponse>, DbInterfaceError> {
    //     let table_row_count: f32 = {
    //         let query = r#"
    // SELECT reltuples AS estimate FROM pg_class where relname = 'prfs_proof_instances';
    // "#;
    //         let row = sqlx::query(query).fetch_one(pool).await.unwrap();

    //         row.get("estimate")
    //     };

    let query = r#"
SELECT * 
FROM prfs_poll_responses
WHERE poll_id=$1
"#;

    let rows = sqlx::query(query)
        .bind(poll_id)
        .fetch_all(pool)
        .await
        .unwrap();

    let prfs_polls = rows
        .iter()
        .map(|row| PrfsPollResponse {
            poll_id: row.get("poll_id"),
            value: row.get("value"),
            proof_instance_id: row.get("proof_instance_id"),
            serial_no: row.get("serial_no"),
        })
        .collect();

    return Ok(prfs_polls);
}

pub async fn insert_prfs_poll_response(
    tx: &mut Transaction<'_, Postgres>,
    submit_poll_response_req: &SubmitPrfsPollResponseRequest,
) -> Result<Uuid, DbInterfaceError> {
    let query = r#"
INSERT INTO prfs_poll_responses
(poll_id, value, proof_instance_id, serial_no)
VALUES ($1, $2, $3, $4) returning poll_id"#;

    let row = sqlx::query(query)
        .bind(&submit_poll_response_req.poll_id)
        .bind(&submit_poll_response_req.value)
        .bind(&submit_poll_response_req.proof_instance_id)
        .bind(&submit_poll_response_req.serial_no)
        .fetch_one(&mut **tx)
        .await
        .unwrap();

    let poll_id: Uuid = row.get("poll_id");

    return Ok(poll_id);
}
