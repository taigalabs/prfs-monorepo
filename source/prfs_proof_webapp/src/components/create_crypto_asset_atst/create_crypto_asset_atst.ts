export const WALLET_ADDR = "wallet_addr";
export const SIGNATURE = "signature";
export const CM = "commitment";
export const ENCRYPT_WALLET_ADDR = "encrypt_wallet_addr";

export type CryptoAssetSizeAtstFormData = {
  [WALLET_ADDR]: string;
  [SIGNATURE]: string;
  [CM]: string;
};
