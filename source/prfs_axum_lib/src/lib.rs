pub mod cors;
pub mod error;
pub mod io;
pub mod macros;
pub mod resp;

pub use error::*;

pub use axum;
pub use axum_extra;
pub use reqwest;
pub use tokio_tungstenite;
pub use tower;
pub use tower_http;

pub type AxumLibError = Box<dyn std::error::Error + Send + Sync>;
