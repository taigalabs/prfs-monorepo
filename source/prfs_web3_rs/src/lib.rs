pub use ethers_signers;

pub mod signature;

pub type PrfsWeb3RsError = Box<dyn std::error::Error + Send + Sync>;
