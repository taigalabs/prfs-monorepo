use serde::{Deserialize, Serialize};

pub fn make_sibling_path(depth: u8, leaf_idx: u128) -> Vec<u128> {
    // let height = depth + 1;
    let mut sibling_indices = vec![];
    let mut curr_idx = leaf_idx;

    for _h in 0..depth {
        let sibling_idx = get_sibling_idx(curr_idx);

        let parent_idx = get_parent_idx(curr_idx);
        curr_idx = parent_idx;
        sibling_indices.push(sibling_idx);
    }

    return sibling_indices;
}

pub fn make_path_indices(depth: u8, leaf_idx: u128) -> Vec<u128> {
    let mut path_indices = vec![];
    let mut curr_idx = leaf_idx;

    for _h in 0..depth {
        let d = get_direction(curr_idx);
        path_indices.push(d);
        let parent_idx = get_parent_idx(curr_idx);
        curr_idx = parent_idx;
    }

    return path_indices;
}

fn get_direction(idx: u128) -> u128 {
    if idx % 2 == 0 {
        0
    } else {
        1
    }
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
