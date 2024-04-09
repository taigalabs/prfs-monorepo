#[cfg(test)]
mod tests;

use primitive_types::U256;

use crate::PrfsCryptoError;

pub fn convert_hex_into_32bytes(val: &str) -> Result<[u8; 32], PrfsCryptoError> {
    let b = hex::decode(&val)
        .map_err(|err| format!("Valid hex string should be provided, err: {}", err))?;

    let bytes: [u8; 32] = b
        .try_into()
        .map_err(|err| format!("hex string is of wrong size, err: {:?}", err))?;

    Ok(bytes)
}

pub fn convert_dec_into_32bytes(var: &str) -> Result<[u8; 32], PrfsCryptoError> {
    let u = U256::from_dec_str(var)?;
    let mut buf = [0u8; 32];
    u.to_little_endian(&mut buf);

    Ok(buf)
}

pub fn convert_32bytes_le_into_decimal_string(val: &[u8; 32]) -> Result<String, PrfsCryptoError> {
    let u = U256::from_little_endian(val);
    Ok(u.to_string())
}
