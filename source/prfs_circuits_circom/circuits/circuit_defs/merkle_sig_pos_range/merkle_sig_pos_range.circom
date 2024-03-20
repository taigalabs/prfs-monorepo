pragma circom 2.1.2;

include "../../../node_modules/circomlib/circuits/comparators.circom";

include "../../gadgets/tree.circom";
include "../../gadgets/poseidon/poseidon.circom";
include "../../gadgets/bigint.circom";
include "../../gadgets/secp256k1_func.circom";

template MerkleSigPosRange(nLevels) {
    signal input assetSize;
    signal input assetSizeGreaterEqThan;
    signal input assetSizeLessThan;
    signal input sigpos;

    // leaf := pos(pos(sigpos), assetSize)
    signal input leaf;
    signal input root;
    signal input pathIndices[nLevels];
    signal input siblings[nLevels];

    signal input proofPubKey;
    signal input nonce;
    // serialNo := pos(sigpos, nonce)
    signal input serialNo;

    component greaterEqThan = GreaterEqThan(16);
    greaterEqThan.in[0] <-- assetSize;
    greaterEqThan.in[1] <-- assetSizeGreaterEqThan;
    greaterEqThan.out === 1;

    component lessThan = LessThan(16);
    lessThan.in[0] <-- assetSize;
    lessThan.in[1] <-- assetSizeLessThan;
    // log("lessThan", lessThan.out);
    lessThan.out === 1;

    component poseidon2 = Poseidon();
    poseidon2.inputs[0] <== sigpos;
    poseidon2.inputs[1] <== assetSize;
    log("leaf", leaf, "computed", poseidon2.out);
    leaf === poseidon2.out;

    component poseidon3 = Poseidon();
    poseidon3.inputs[0] <== sigpos;
    poseidon3.inputs[1] <== nonce;
    log("sigposAndNonce", poseidon3.out);

    component poseidon4 = Poseidon();
    poseidon4.inputs[0] <== poseidon3.out;
    poseidon4.inputs[1] <== proofPubKey;
    // log("serialNo", serialNo, "computed", poseidon4.out);
    serialNo === poseidon4.out;

    component merkleProof = MerkleTreeInclusionProof(nLevels);
    merkleProof.leaf <== leaf;

    for (var i = 0; i < nLevels; i++) {
        merkleProof.pathIndices[i] <== pathIndices[i];
        merkleProof.siblings[i] <== siblings[i];
    }

    log("root", root, "merkleProof root", merkleProof.root);
    // root === merkleProof.root;
}
