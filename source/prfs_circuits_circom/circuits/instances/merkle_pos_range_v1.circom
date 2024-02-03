pragma circom 2.1.2;

include "../circuit_defs/merkle_pos_range/merkle_pos_range.circom";

component main { public[ root ]} = MerklePosRange(32);
