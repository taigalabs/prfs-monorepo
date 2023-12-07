mod api;
pub mod wasm;

pub type PrfsDriverUtilsWasmError = Box<dyn std::error::Error + Sync + Send>;
