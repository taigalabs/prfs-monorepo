export function makePathIndices(depth, leafIdx) {
    let pathIndices = [];
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
export function makeSiblingPath(depth, leafIdx) {
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
function getSiblingIdx(idx) {
    if (idx % 2 == 0) {
        return idx + 1;
    }
    else {
        return idx - 1;
    }
}
function getParentIdx(idx) {
    return Math.floor(idx / 2);
}
function getDirection(idx) {
    if (idx % 2 == 0) {
        return 0;
    }
    else {
        return 1;
    }
}
