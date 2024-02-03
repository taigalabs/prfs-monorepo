pragma circom 2.1.2;

include "../circuit_defs/eff_ecdsa_membership/addr_membership2.circom";

component main { public[ root, serialNo ]} = AddrMembership2(32);
