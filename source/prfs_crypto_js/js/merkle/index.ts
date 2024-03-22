import { bigIntToLeBytes, bytesLeToBigInt } from "../bigint";
import { poseidon_2, poseidon_2_bigint_le } from "../poseidon";

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
  let leaf_ = bigIntToLeBytes(leaf, 32);
  let curr = leaf_;
  for (const [idx, path] of pathIndices.entries()) {
    const sibling = siblings[idx];
    const sibling_ = bigIntToLeBytes(sibling, 32);
    if (path === 0) {
      const args = new Uint8Array(64);
      args.set(curr, 0);
      args.set(sibling_, 32);
      curr = await poseidon_2(args);
    } else if (path === 1) {
      const args = new Uint8Array(64);
      args.set(sibling_, 0);
      args.set(curr, 32);
      curr = await poseidon_2(args);
    } else {
      throw new Error("Invalid path index!");
    }
  }

  return bytesLeToBigInt(curr);
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
