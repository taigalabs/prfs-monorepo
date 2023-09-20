pragma circom 2.1.2;

include "../eff_ecdsa_membership/zauth_def_1.circom";

component main { public[ Tx, Ty, Ux, Uy ]} = ZAuth1();
