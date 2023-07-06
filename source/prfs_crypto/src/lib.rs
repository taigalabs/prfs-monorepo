mod merkletree;

pub use merkletree::*;

pub type PrfsCryptoError = Box<dyn std::error::Error + Send + Sync>;
