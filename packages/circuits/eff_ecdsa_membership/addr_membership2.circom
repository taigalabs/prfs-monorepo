pragma circom 2.1.2;

include "./eff_ecdsa.circom";
include "./ecdsa.circom";
include "./tree.circom";
include "./to_address/zk-identity/eth.circom";

include "./bigint.circom";
include "./secp256k1_func.circom";

/**
 *  AddrMembership
 *  ==============
 *  
 *  Checks that an inputted efficient ECDSA signature (definition and discussion 
 *  can be found at https://personaelabs.org/posts/efficient-ecdsa-1/) 
 *  is signed by a public key that when converted to an address is a member of
 *  a Merkle tree of addresses. The public key is extracted from the efficient 
 *  ECDSA signature in EfficientECDSA(), and converted to an address by Keccak
 *  hashing the public key in PubkeyToAddress().
 */
template AddrMembership2(nLevels, n, k) {
    signal input m;
    signal input r;
    signal input s2[k];

    signal input s;
    signal input root;
    signal input Tx; 
    signal input Ty; 
    signal input Ux;
    signal input Uy;
    signal input pathIndices[nLevels];
    signal input siblings[nLevels];

    component ecdsa = ECDSA();
    ecdsa.Tx <== Tx;
    ecdsa.Ty <== Ty;
    ecdsa.Ux <== Ux;
    ecdsa.Uy <== Uy;
    ecdsa.s <== s;
    ecdsa.r <== r;
    /* ecdsa.m <== m; */

    /* signal y; */
    /* y <-- 2; */

    /* log(y); */
    /* log(1/y); */
    log("ecdsa pubKeyX", ecdsa.pubKeyX);
    log("ecdsa pubKeyY", ecdsa.pubKeyY);

    var p[100] = get_secp256k1_prime(n, k);
    var order[100] = get_secp256k1_order(n, k);

    for (var i = 0; i < 100; i +=1) {
      log("p i: ", i, "val: ", p[i]);
      log("order i: ", i, "val: ", order[i]);
    }

    // compute multiplicative inverse of s mod n
    var sinv_comp[100] = mod_inv(n, k, s2, order);
    for (var i = 0; i < 100; i +=1) {
      log("sinv i: ", i, "val: ", sinv_comp[i]);
    }

    component pubKeyXBits = Num2Bits(256);
    pubKeyXBits.in <== ecdsa.pubKeyX;

    component pubKeyYBits = Num2Bits(256);
    pubKeyYBits.in <== ecdsa.pubKeyY;

    component pubToAddr = PubkeyToAddress();

    for (var i = 0; i < 256; i++) {
        pubToAddr.pubkeyBits[i] <== pubKeyYBits.out[i];
        pubToAddr.pubkeyBits[i + 256] <== pubKeyXBits.out[i];
    }

    log("public addr (leaf)", pubToAddr.address);

    component merkleProof = MerkleTreeInclusionProof(nLevels);
    merkleProof.leaf <== pubToAddr.address;

    for (var i = 0; i < nLevels; i++) {
        merkleProof.pathIndices[i] <== pathIndices[i];
        merkleProof.siblings[i] <== siblings[i];
    }

    log("root (given)", root); 
    log("merkleProof root", merkleProof.root);

    root === merkleProof.root;
}
