mod merkletree;
mod poseidon;

pub use crate::poseidon::*;
pub use ::poseidon::poseidon_k256::hash;
pub use merkletree::*;

pub type PrfsCryptoError = Box<dyn std::error::Error + Send + Sync>;
