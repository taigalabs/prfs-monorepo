pub mod apis;
pub mod database2;
pub mod utils;

pub use apis as db_apis;

pub type DbInterfaceError = Box<dyn std::error::Error + Send + Sync>;
