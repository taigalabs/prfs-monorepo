use crate::PrfsCryptoError;
use primitive_types::U256;

// pub fn convert_bytes_into_decimal_str(bytes: &[u8; 32]) -> Result<String, PrfsCryptoError> {
//     let hex_val = hex::encode(bytes);

//     let leaf_decimal = U256::from_str_radix(&hex_val, 16).unwrap();

//     return Ok(leaf_decimal.to_string());
// }

// pub fn convert_bytes_into_u128(bytes: &[u8; 32]) -> Result<u128, PrfsCryptoError> {
//     let hex_val = hex::encode(bytes);

//     let leaf_decimal = U256::from_str_radix(&hex_val, 16).unwrap();

//     return Ok(leaf_decimal.as_u128());
// }
pub fn convert_hex_into_32bytes(val: &str) -> Result<[u8; 32], PrfsCryptoError> {
    let leaf_decimal = U256::from_str_radix(&val, 16)?;
    let mut b = [0u8; 32];
    leaf_decimal.to_little_endian(&mut b);
    println!("leaf decimal: {}, bytes: {:?}", leaf_decimal, b);

    Ok(b)
}

pub fn convert_32bytes_into_decimal_string(val: &[u8; 32]) -> Result<String, PrfsCryptoError> {
    let u = U256::from_little_endian(val);
    Ok(u.to_string())
}
