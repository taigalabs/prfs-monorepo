use primitive_types::U256;

use crate::PrfsCryptoError;

pub fn convert_bytes_into_decimal_str(bytes: &[u8; 32]) -> Result<String, PrfsCryptoError> {
    let hex_val = hex::encode(bytes);

    let leaf_decimal = U256::from_str_radix(&hex_val, 16).unwrap();

    return Ok(leaf_decimal.to_string());
}

pub fn convert_bytes_into_u128(bytes: &[u8; 32]) -> Result<u128, PrfsCryptoError> {
    let hex_val = hex::encode(bytes);

    let leaf_decimal = U256::from_str_radix(&hex_val, 16).unwrap();

    return Ok(leaf_decimal.as_u128());
}
