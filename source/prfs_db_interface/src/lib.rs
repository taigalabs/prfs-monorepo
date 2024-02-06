pub mod database2;
pub mod events;
pub mod prfs;
pub mod shy;
pub mod utils;

pub type DbInterfaceError = Box<dyn std::error::Error + Send + Sync>;
