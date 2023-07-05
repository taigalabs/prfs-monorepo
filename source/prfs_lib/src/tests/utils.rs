pub fn hex_to_str(hex_string: &str) {
    let without_prefix = hex_string.trim_start_matches("0x");
    let z = i64::from_str_radix(without_prefix, 16);
    println!("{:?}", z);
    // return z;
}
