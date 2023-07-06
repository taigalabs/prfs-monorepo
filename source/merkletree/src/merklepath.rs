use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SiblingPath {
    pub sibling_indices: Vec<u128>,
}

pub fn make_sibling_path(depth: u32, leaf_idx: u128) -> SiblingPath {
    // let height = depth + 1;
    let mut sibling_indices = vec![];
    let mut curr_idx = leaf_idx;

    for _h in 0..depth {
        let sibling_idx = get_sibling_idx(curr_idx);

        let parent_idx = get_parent_idx(curr_idx);
        curr_idx = parent_idx;
        sibling_indices.push(sibling_idx);
    }

    SiblingPath { sibling_indices }
}

fn get_sibling_idx(idx: u128) -> u128 {
    if idx % 2 == 0 {
        idx + 1
    } else {
        idx - 1
    }
}

pub fn get_parent_idx(idx: u128) -> u128 {
    idx / 2
}
