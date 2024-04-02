use super::rand256_hex;

#[test]
pub fn test_rand1() {
    let hex = rand256_hex();
    println!("hex: {}", hex);
}
