pragma circom 2.1.2;

include "../circuit_defs/eff_ecdsa_membership/addr_membership.circom";

component main { public[ root, Tx, Ty, Ux, Uy ]} = AddrMembership(20);
