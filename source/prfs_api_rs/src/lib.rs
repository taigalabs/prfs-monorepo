pub mod api;

pub type PrfsApiError = Box<dyn std::error::Error + Send + Sync>;
