pragma circom 2.1.2;

include "../../gadgets/tree.circom";
include "../../gadgets/poseidon/poseidon.circom";
include "../../gadgets/bigint.circom";
include "../../gadgets/secp256k1_func.circom";

template MerklePosRange(nLevels) {
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

    // merkle proof
    signal input root;
    signal input pathIndices[nLevels];
    signal input siblings[nLevels];

    // Serial number
    // component poseidon = Poseidon();
    // poseidon.inputs[0] <== s;
    // poseidon.inputs[1] <== 0;
    // serialNo === poseidon.out;

    component merkleProof = MerkleTreeInclusionProof(nLevels);
    merkleProof.leaf <== leaf;

    for (var i = 0; i < nLevels; i++) {
        merkleProof.pathIndices[i] <== pathIndices[i];
        merkleProof.siblings[i] <== siblings[i];
    }

    log("root (given)", root); 
    // log("merkleProof root", merkleProof.root);

    root === merkleProof.root;
}
