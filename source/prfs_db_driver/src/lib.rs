pub mod database2;

pub type DbDriverError = Box<dyn std::error::Error + Send + Sync>;

pub use prfs_db_lib::sqlx;
