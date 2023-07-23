pub mod apis;
pub mod config;
pub mod database;
pub mod hexutils;
pub mod models;

pub type DbInterfaceError = Box<dyn std::error::Error + Send + Sync>;
