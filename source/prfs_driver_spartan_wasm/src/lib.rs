mod api;
pub mod wasm;

#[cfg(test)]
mod test;

pub type PrfsDriverSpartanWasmError = Box<dyn std::error::Error + Sync + Send>;
