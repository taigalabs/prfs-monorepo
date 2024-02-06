use prfs_entities::sqlx::{postgres::PgListener, Pool, Postgres};

use crate::DbInterfaceError;

pub const PRFS_ID_SESSION_CHAN: &str = "prfs_id_session_chan";

pub async fn listen_to_prfs_id_session_events(
    pool: &Pool<Postgres>,
) -> Result<PgListener, DbInterfaceError> {
    let mut listener = PgListener::connect_with(&pool).await.unwrap();

    listener.listen(PRFS_ID_SESSION_CHAN).await.unwrap();

    Ok(listener)
}
