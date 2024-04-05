pragma circom 2.1.2;

include "../circuit_defs/merkle_sig_pos_exact_v1/merkle_sig_pos_exact_v1.circom";

component main { public [ 
  root, 
  nonce,
  proofPubKey,
  serialNo,
  value
] } = MerkleSigPosExactV1(32);
