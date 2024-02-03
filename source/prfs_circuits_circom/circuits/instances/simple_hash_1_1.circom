pragma circom 2.1.2;

include "../circuit_defs/simple_hash/simple_hash_1.circom";

component main { public[ msgHash ]} = SimpleHash1();
