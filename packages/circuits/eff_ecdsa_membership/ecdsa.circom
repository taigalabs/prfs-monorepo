pragma circom 2.1.2;

include "./secp256k1/mul.circom";
include "../../../node_modules/circomlib/circuits/bitify.circom";

/**
 *  ECDSA
 *  ====================
 *  
 */
template ECDSA() {
    var bits = 256;

    //
    /* signal input r; */
    /* signal input r2; */

    /* signal input m; */
    signal input s;

    signal input Tx; // T = r^-1 * R
    signal input Ty; 
    signal input Ux; // U = -(m * r^-1 * G)
    signal input Uy;

    signal output pubKeyX;
    signal output pubKeyY;
  
    log(123123);
    /* var x; */
    /* x = 1 / r2; */

    // sMultT = s * T
    component sMultT = Secp256k1Mul();
    sMultT.scalar <== s;
    sMultT.xP <== Tx;
    sMultT.yP <== Ty;

    // pubKey = sMultT + U 
    component pubKey = Secp256k1AddComplete();
    pubKey.xP <== sMultT.outX;
    pubKey.yP <== sMultT.outY;
    pubKey.xQ <== Ux;
    pubKey.yQ <== Uy;

    pubKeyX <== pubKey.outX;
    pubKeyY <== pubKey.outY;
}
