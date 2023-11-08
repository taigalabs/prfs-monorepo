pragma circom 2.1.2;

include "../eff_ecdsa_membership/eff_ecdsa.circom";
include "../eff_ecdsa_membership/ecdsa.circom";
include "../eff_ecdsa_membership/tree.circom";
include "../eff_ecdsa_membership/to_address/zk-identity/eth.circom";
include "../eff_ecdsa_membership/bigint.circom";
include "../eff_ecdsa_membership/secp256k1_func.circom";
include "../poseidon/poseidon.circom";

template SimpleHash1() {
    signal input msgRawInt;
    signal input msgHash;

    log("msgRawInt", msgRawInt);
    log("msgHash", msgHash);

    component poseidon = Poseidon();
    poseidon.inputs[0] <== msgRawInt;
    poseidon.inputs[1] <== 0;

    log("pos out", poseidon.out);

    poseidon.out === msgHash;
}
