pub mod database2;

pub type DbDriverError = Box<dyn std::error::Error + Send + Sync>;
