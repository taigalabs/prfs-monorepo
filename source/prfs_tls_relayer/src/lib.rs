pub mod crawler;
pub mod destinations;

#[cfg(test)]
pub mod tests;

pub type TLSRelayError = Box<dyn std::error::Error + Send + Sync>;
