pub mod config;
pub mod db;
pub mod hexutils;

pub use db::*;

pub type DbInterfaceError = Box<dyn std::error::Error + Send + Sync>;
