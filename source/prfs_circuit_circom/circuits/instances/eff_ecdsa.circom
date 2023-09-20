pragma circom 2.1.2;

include "../eff_ecdsa_membership/eff_ecdsa_to_addr.circom";

template EfficientECDSAToAddr2() {
    signal input Tx; 
    signal input Ty; 
    signal input Ux;
    signal input Uy;

    /* signal input m; */
    /* signal input r; */
    signal input s;

    component ecdsa = EfficientECDSAToAddr();
    ecdsa.Tx <== Tx;
    ecdsa.Ty <== Ty;
    ecdsa.Ux <== Ux;
    ecdsa.Uy <== Uy;
    ecdsa.s <== s;
}


component main { public[ Tx, Ty, Ux, Uy ]} = EfficientECDSAToAddr2();
