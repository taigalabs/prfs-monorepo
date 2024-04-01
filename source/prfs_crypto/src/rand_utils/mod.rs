use crypto_bigint::{Random, U256};
use rand::rngs::OsRng;

pub fn rand256_hex() -> String {
    let u256 = U256::random(&mut OsRng);
    return u256.to_string();
}
