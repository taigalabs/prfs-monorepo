mod api;
pub mod wasm;

#[cfg(test)]
pub mod test;

pub type PrfsDriverUtilsWasmError = Box<dyn std::error::Error + Sync + Send>;
