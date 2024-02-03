pragma circom 2.1.2;

include "../circuit_defs/eff_ecdsa_membership/addr_membership2.circom";

component main { public[ root, Tx, Ty, Ux, Uy, serialNo ]} = AddrMembership2(32);
