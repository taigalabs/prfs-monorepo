pragma circom 2.1.2;

include "../simple_hash/simple_hash_1.circom";

component main { public[ Tx, Ty, Ux, Uy ]} = SimpleHash1();
