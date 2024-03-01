pragma circom 2.1.2;

include "../circuit_defs/merkle_sig_pos_range/merkle_sig_pos_range.circom";

component main { public [ 
  root, 
  nonce,
  proofPubKey,
  serialNo,
  assetSizeGreaterEqThan, 
  assetSizeLessThan 
] } = MerkleSigPosRange(32);
