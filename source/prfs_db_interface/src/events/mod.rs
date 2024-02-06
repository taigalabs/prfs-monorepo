use prfs_entities::sqlx::{postgres::PgListener, Pool, Postgres};

use crate::DbInterfaceError;

pub const PRFS_ID_SESSION_CHAN: &str = "prfs_id_session_chan";

pub async fn start_listening_to_prfs_id_session_events(
    pool: &Pool<Postgres>,
) -> Result<PgListener, DbInterfaceError> {
    println!("Start_listening to prfs id session events");

    let mut listener = PgListener::connect_with(&pool).await.unwrap();
    listener.listen(PRFS_ID_SESSION_CHAN).await.unwrap();

    let mut counter = 0usize;
    loop {
        let notification = listener.recv().await?;
        println!("[from recv]: {notification:?}");

        counter += 1;
        if counter >= 3 {
            break;
        }
    }

    Ok(listener)
}
