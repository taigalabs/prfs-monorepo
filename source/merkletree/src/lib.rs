mod tree;

#[cfg(test)]
mod test;

pub type MerkleTreeError = Box<dyn std::error::Error + Send + Sync>;
