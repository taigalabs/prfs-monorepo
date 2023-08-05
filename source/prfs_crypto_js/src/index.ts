export function makeMerklePath() {
  return 3;
}

export function makeSiblingPath() {
  return 5;
}

// pub fn make_sibling_path(depth: u32, leaf_idx: u128) -> Vec<u128> {
//     // let height = depth + 1;
//     let mut sibling_indices = vec![];
//     let mut curr_idx = leaf_idx;

//     for _h in 0..depth {
//         let sibling_idx = get_sibling_idx(curr_idx);

//         let parent_idx = get_parent_idx(curr_idx);
//         curr_idx = parent_idx;
//         sibling_indices.push(sibling_idx);
//     }

//     return sibling_indices;
// }

// pub fn make_path_indices(depth: u32, leaf_idx: u128) -> Vec<u128> {
//     let mut path_indices = vec![];
//     let mut curr_idx = leaf_idx;

//     for _h in 0..depth {
//         path_indices.push(curr_idx);
//         let parent_idx = get_parent_idx(curr_idx);
//         curr_idx = parent_idx;
//     }

//     return path_indices;
// }

// function getSiblingIdx(idx: number): number {
//   if (idx % 2 == 0) {
//     return idx + 1;
//   } else {
//     return idx - 1;
//   }
// }

// function getParentIdx(idx: number): number {
//   return idx / 2;
// }
