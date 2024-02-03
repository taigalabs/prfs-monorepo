pragma circom 2.1.2;

include "../../gadgets/eff_ecdsa.circom";
include "../../gadgets/tree.circom";
include "../../gadgets/to_address/zk-identity/eth.circom";
include "../../gadgets/bigint.circom";
include "../../gadgets/secp256k1_func.circom";
include "../../gadgets/ecdsa.circom";
include "../../gadgets/poseidon/poseidon.circom";

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
