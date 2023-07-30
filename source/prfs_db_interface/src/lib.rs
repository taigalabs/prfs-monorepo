pub mod apis;
pub mod database;
pub mod database2;
pub mod models;
pub mod utils;

pub type DbInterfaceError = Box<dyn std::error::Error + Send + Sync>;
