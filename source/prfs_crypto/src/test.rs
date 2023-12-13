use crate::poseidon_2;

#[test]
pub fn test_poseidon1() {
    let arg1: &[u8; 32] = &[0u8; 32];
    let arg2: &[u8; 32] = &[1u8; 32];
    println!("arg1: {:?}, arg2: {:?}", arg1, arg2);

    let hash = poseidon_2(arg1, arg2);
    println!("hash: {:?}", hash);
}
