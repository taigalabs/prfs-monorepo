pub mod destinations;

#[cfg(test)]
pub mod tests;

pub type WebScraperError = Box<dyn std::error::Error + Send + Sync>;
