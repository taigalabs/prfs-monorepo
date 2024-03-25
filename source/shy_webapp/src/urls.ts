import { envs } from "./envs";
import { paths } from "./paths";

export const urls = {
  createCryptoAssetAttestion: `${envs.NEXT_PUBLIC_PRFS_PROOF_WEBAPP_ENDPOINT}/\
attestations/create/crypto_asset_size`,
  prfs__success: `${envs.NEXT_PUBLIC_SHY_WEBAPP_ENDPOINT}/${paths.prfs__success}`,
};
