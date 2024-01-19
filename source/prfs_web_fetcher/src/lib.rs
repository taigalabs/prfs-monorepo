pub mod crawler;
pub mod destinations;
pub mod tokio;

pub(crate) mod envs;

pub type WebFetcherError = Box<dyn std::error::Error + Send + Sync>;
