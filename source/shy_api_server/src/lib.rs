mod apis;
pub mod envs;
pub mod log;
pub mod paths;
pub mod router;

#[cfg(test)]
pub mod tests;

pub type ShyServerError = Box<dyn std::error::Error + Send + Sync>;
