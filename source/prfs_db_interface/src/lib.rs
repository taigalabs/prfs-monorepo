pub mod prfs;

pub type DbInterfaceError = Box<dyn std::error::Error + Send + Sync>;
