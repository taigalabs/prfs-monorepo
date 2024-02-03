pragma circom 2.1.2;

include "../../lib/tree/tree.circom";
include "../../lib/poseidon/poseidon.circom";

include "../../lib/bigint.circom";
include "../../lib/secp256k1_func.circom";

template MerklePosRange(nLevels) {
    // eff ecdsa
    signal input Tx; 
    signal input Ty; 
    signal input Ux;
    signal input Uy;

    signal input m;
    signal input r;
    signal input s;
    signal input serialNo;

    // merkle proof
    signal input root;
    signal input pathIndices[nLevels];
    signal input siblings[nLevels];

    component ecdsa = ECDSA2();
    ecdsa.Tx <== Tx;
    ecdsa.Ty <== Ty;
    ecdsa.Ux <== Ux;
    ecdsa.Uy <== Uy;
    ecdsa.s <== s;

    // log("ecdsa pubKeyX", ecdsa.pubKeyX);
    // log("ecdsa pubKeyY", ecdsa.pubKeyY);

    // Serial number
    component poseidon = Poseidon();
    poseidon.inputs[0] <== s;
    poseidon.inputs[1] <== 0;
    serialNo === poseidon.out;

    component pubKeyXBits = Num2Bits(256);
    pubKeyXBits.in <== ecdsa.pubKeyX;

    component pubKeyYBits = Num2Bits(256);
    pubKeyYBits.in <== ecdsa.pubKeyY;

    component pubToAddr = PubkeyToAddress();

    for (var i = 0; i < 256; i++) {
        pubToAddr.pubkeyBits[i] <== pubKeyYBits.out[i];
        pubToAddr.pubkeyBits[i + 256] <== pubKeyXBits.out[i];
    }

    // log("public addr (leaf)", pubToAddr.address);

    component merkleProof = MerkleTreeInclusionProof(nLevels);
    merkleProof.leaf <== pubToAddr.address;

    for (var i = 0; i < nLevels; i++) {
        merkleProof.pathIndices[i] <== pathIndices[i];
        merkleProof.siblings[i] <== siblings[i];
    }

    // log("root (given)", root); 
    // log("merkleProof root", merkleProof.root);

    root === merkleProof.root;
}
