pragma circom 2.1.2;

include "./eff_ecdsa.circom";
include "./ecdsa.circom";
include "./tree.circom";
include "./to_address/zk-identity/eth.circom";
include "../poseidon/poseidon.circom";

include "./bigint.circom";
include "./secp256k1_func.circom";

template SimpleHash1() {
    signal input Tx; 
    signal input Ty; 
    signal input Ux;
    signal input Uy;

    signal input s;

    component ecdsa = ECDSA2();
    ecdsa.Tx <== Tx;
    ecdsa.Ty <== Ty;
    ecdsa.Ux <== Ux;
    ecdsa.Uy <== Uy;
    ecdsa.s <== s;

    component pubKeyXBits = Num2Bits(256);
    pubKeyXBits.in <== ecdsa.pubKeyX;

    component pubKeyYBits = Num2Bits(256);
    pubKeyYBits.in <== ecdsa.pubKeyY;

    component pubToAddr = PubkeyToAddress();

    for (var i = 0; i < 256; i++) {
        pubToAddr.pubkeyBits[i] <== pubKeyYBits.out[i];
        pubToAddr.pubkeyBits[i + 256] <== pubKeyXBits.out[i];
    }

    log("addr", pubToAddr.address);

    /* component merkleProof = MerkleTreeInclusionProof(nLevels); */
    /* merkleProof.leaf <== pubToAddr.address; */

    /* for (var i = 0; i < nLevels; i++) { */
    /*     merkleProof.pathIndices[i] <== pathIndices[i]; */
    /*     merkleProof.siblings[i] <== siblings[i]; */
    /* } */

    /* // log("root (given)", root);  */
    /* // log("merkleProof root", merkleProof.root); */

    /* root === merkleProof.root; */
}
