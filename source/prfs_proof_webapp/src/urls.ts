import { envs } from "./envs";
import { paths } from "./paths";

export const urls = {
  attestations: `${envs.NEXT_PUBLIC_PRFS_PROOF_WEBAPP_ENDPOINT}${paths.attestations}`,
  privacy: `${envs.NEXT_PUBLIC_PRFS_PROOF_WEBAPP_ENDPOINT}${paths.privacy}`,
  updates: `${envs.NEXT_PUBLIC_PRFS_PROOF_WEBAPP_ENDPOINT}${paths.updates}`,
  sets: `${envs.NEXT_PUBLIC_PRFS_PROOF_WEBAPP_ENDPOINT}/${paths.sets}`,
  proof_types: `${envs.NEXT_PUBLIC_PRFS_PROOF_WEBAPP_ENDPOINT}/${paths.proof_types}`,
};
