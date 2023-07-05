pub mod wasm;

pub use wasm::*;

pub type PrfsLibError = Box<dyn std::error::Error + Sync + Send>;

#[cfg(test)]
mod tests;
