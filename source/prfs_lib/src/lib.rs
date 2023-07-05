pub mod api;

pub use api::*;

pub type PrfsLibError = Box<dyn std::error::Error + Sync + Send>;

#[cfg(test)]
mod tests;
