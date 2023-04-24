pragma circom 2.1.2;

include "../eff_ecdsa_membership/addr_membership2.circom";

component main { public[ r, root, Tx, Ty, Ux, Uy ]} = AddrMembership2(20);
