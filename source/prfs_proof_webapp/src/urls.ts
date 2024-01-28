import { paths } from "./paths";

export const urls = {
  tutorial: `${process.env.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}?tutorial_id=simple_hash`,
  attestations: `${process.env.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}${paths.attestations}`,
  sets: `${process.env.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}${paths.sets}`,
  proof_types: `${process.env.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}${paths.proof_types}`,
};
