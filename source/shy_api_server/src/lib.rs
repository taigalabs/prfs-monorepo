mod apis;
pub mod envs;
mod error_codes;
pub mod log;
pub mod paths;
pub mod router;

#[cfg(test)]
mod tests;

pub type ShyServerError = Box<dyn std::error::Error + Send + Sync>;
