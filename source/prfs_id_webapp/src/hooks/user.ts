import { useAppSelector } from "@/state/hooks";

export function useSignedInUser() {
  const isCredentialInitialized = useAppSelector(state => state.user.isInitialized);
  const prfsProofCredential = useAppSelector(state => state.user.prfsIdCredential);

  return { isCredentialInitialized, prfsProofCredential };
}
