mod api;
pub mod wasm;

pub type PrfsProgramSpartanWasmError = Box<dyn std::error::Error + Sync + Send>;
