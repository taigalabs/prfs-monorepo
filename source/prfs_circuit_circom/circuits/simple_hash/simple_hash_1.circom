pragma circom 2.1.2;

include "../eff_ecdsa_membership/eff_ecdsa.circom";
include "../eff_ecdsa_membership/ecdsa.circom";
include "../eff_ecdsa_membership/tree.circom";
include "../eff_ecdsa_membership/to_address/zk-identity/eth.circom";
include "../eff_ecdsa_membership/bigint.circom";
include "../eff_ecdsa_membership/secp256k1_func.circom";

include "../poseidon/poseidon.circom";

template SimpleHash1() {
    signal input s;
    signal input image;

    log("s", s);
    log("image", image);

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
