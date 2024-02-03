use crate::PrfsCryptoError;
use primitive_types::U256;

pub fn convert_hex_into_32bytes(val: &str) -> Result<[u8; 32], PrfsCryptoError> {
    let leaf_decimal = U256::from_str_radix(&val, 16)?;
    let mut b = [0u8; 32];
    leaf_decimal.to_little_endian(&mut b);

    Ok(b)
}

pub fn convert_dec_into_32bytes(var: &str) -> Result<[u8; 32], PrfsCryptoError> {
    let u = U256::from_dec_str(var).unwrap();
    let mut buf = [0u8; 32];
    u.to_little_endian(&mut buf);

    Ok(buf)
}

pub fn convert_32bytes_le_into_decimal_string(val: &[u8; 32]) -> Result<String, PrfsCryptoError> {
    let u = U256::from_little_endian(val);
    Ok(u.to_string())
}
