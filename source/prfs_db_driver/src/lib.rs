pub mod database2;
pub mod executor;

pub type DbDriverError = Box<dyn std::error::Error + Send + Sync>;

pub use sqlx;
