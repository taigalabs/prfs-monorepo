export function makePathIndices(depth: number, leafIdx: number): number[] {
  let pathIndices: number[] = [];
  let currIdx = leafIdx;

  for (let h = 0; h < depth; h += 1) {
    let d = getDirection(currIdx);
    // console.log("h: %s, d: %s, currIdx: %s", h, d, currIdx);
    pathIndices.push(d);
    let parent_idx = getParentIdx(currIdx);
    currIdx = parent_idx;
  }

  return pathIndices;
}

export function makeSiblingPath(depth: number, leafIdx: number): number[] {
  const siblingIndices = [];
  let currIdx = leafIdx;

  for (let h = 0; h < depth; h += 1) {
    let siblingIdx = getSiblingIdx(currIdx);
    let parentIdx = getParentIdx(currIdx);

    currIdx = parentIdx;
    siblingIndices.push(siblingIdx);
  }

  return siblingIndices;
}

export async function computeRoot(leaf: bigint, siblings: bigint[], pathIndices: number[]) {
  let curr: Uint8Array;
  for (const [idx, path] of pathIndices.entries()) {
    console.log(11, siblings[idx], path);
    if (idx) {
      // curr siblings[]
    } else {
    }
  }

  return new Uint8Array();
}

function getSiblingIdx(idx: number): number {
  if (idx % 2 == 0) {
    return idx + 1;
  } else {
    return idx - 1;
  }
}

function getParentIdx(idx: number): number {
  return Math.floor(idx / 2);
}

function getDirection(idx: number): number {
  if (idx % 2 == 0) {
    return 0;
  } else {
    return 1;
  }
}
