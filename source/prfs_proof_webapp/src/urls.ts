import { envs } from "./envs";
import { paths, consolePaths } from "./paths";

export const urls = {
  tutorial: `${envs.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}?tutorial_id=simple_hash`,
  attestations: `${envs.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}${paths.attestations}`,
  privacy: `${envs.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}${paths.privacy}`,
  updates: `${envs.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}${paths.updates}`,
  console__sets: `${envs.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT}/${consolePaths.sets}`,
  console__proof_types: `${envs.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT}/${consolePaths.proof_types}`,
};
