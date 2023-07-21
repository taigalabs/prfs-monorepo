pragma circom 2.1.2;

include "./secp256k1/mul.circom";
include "../node_modules/circomlib/circuits/bitify.circom";

/**
 *  ECDSA
 *  ====================
 *  
 */
template ECDSA() {
    var bits = 256;

    //
    signal input r;
    signal input sInv;

    signal input m;
    signal input s;

    signal input Tx; // T = r^-1 * R
    signal input Ty; 
    signal input Ux; // U = -(m * r^-1 * G)
    signal input Uy;

    signal output pubKeyX;
    signal output pubKeyY;
  
    log("sInv", sInv);
    log("m", m);
      
    /* const u1 = m.mul(sInv).mod(SECP256K1_N); */
    /* const u2 = new BN(r as any).mul(sInv).mod(SECP256K1_N); */
    /* let p1 = ec.curve.g.mul(u1); */
    /* let p2 = q.mul(u2); */
    /* let p3 = p1.add(p2); */

    signal u1 <== m * sInv;
    signal u2 <== r * sInv; 

    log("u1", u1);
    log("u2", u2);

    /* component a1 = Secp256k1Mul(); */
    /* a1.scalar <== u1; */

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
