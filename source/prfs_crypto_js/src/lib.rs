mod api;
pub mod wasm;

pub type PrfsDriverSpartanWasmError = Box<dyn std::error::Error + Sync + Send>;
