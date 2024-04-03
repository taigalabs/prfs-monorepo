export const WALLET_ADDR = "wallet_addr";
export const SIGNATURE = "signature";
export const CM = "commitment";
export const ENCRYPT_WALLET_ADDR = "encrypt_wallet_addr";

// export enum AttestationStep {
//   INPUT_WALLET_ADDR = 0,
//   GENERATE_CLAIM,
//   POST_TWEET,
//   VALIDATE_TWEET,
// }

export type CryptoAssetSizeAtstFormData = {
  [WALLET_ADDR]: string;
  [SIGNATURE]: string;
  [CM]: string;
};
