pub mod crawler;
pub mod destinations;
pub mod tokio;

#[cfg(test)]
pub mod tests;

pub type WebFetcherError = Box<dyn std::error::Error + Send + Sync>;
