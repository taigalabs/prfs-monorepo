pragma circom 2.1.2;

include "../../../node_modules/circomlib/circuits/comparators.circom";

include "../../gadgets/tree.circom";
include "../../gadgets/poseidon/poseidon.circom";
include "../../gadgets/bigint.circom";
include "../../gadgets/secp256k1_func.circom";

template MerkleSigPosRange(nLevels) {
    // eff ecdsa
    // signal input Tx; 
    // signal input Ty; 
    // signal input Ux;
    // signal input Uy;

    // signal input m;
    // signal input r;
    // signal input s;
    // signal input serialNo;
    signal input leaf;
    signal input asset_size;
    signal input asset_size_max_limit;

    // merkle proof
    signal input root;
    signal input pathIndices[nLevels];
    signal input siblings[nLevels];

    component lessThan = LessThan(16);
    lessThan.in[0] <-- asset_size;
    lessThan.in[1] <-- asset_size_max_limit;

    log("lessThan", lessThan.out);
    lessThan.out === 1;

    // Serial number
    // component poseidon = Poseidon();
    // poseidon.inputs[0] <== s;
    // poseidon.inputs[1] <== 0;
    // serialNo === poseidon.out;
    log("leaf", leaf); 

    component merkleProof = MerkleTreeInclusionProof(nLevels);
    merkleProof.leaf <== leaf;

    for (var i = 0; i < nLevels; i++) {
        merkleProof.pathIndices[i] <== pathIndices[i];
        merkleProof.siblings[i] <== siblings[i];
    }

    log("root", root, "merkleProof root", merkleProof.root);

    root === merkleProof.root;
}
