use crate::merklepath::{make_sibling_path, SiblingPath};

#[test]
fn test_merkle_path() {
    let sibling_path = make_sibling_path(4, 0);

    println!("sibling_path: {:?}", sibling_path);
}
