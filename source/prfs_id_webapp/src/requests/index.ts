import { idApi } from "@taigalabs/prfs-api-js";
import { SignInPrfsIdentityRequest } from "@taigalabs/prfs-entities/bindings/SignInPrfsIdentityRequest";
import { useMutation } from "@taigalabs/prfs-react-lib/react_query";

export function useSignInPrfsIdentity() {
  return useMutation({
    mutationFn: (req: SignInPrfsIdentityRequest) => {
      return idApi({ type: "sign_in_prfs_identity", ...req });
    },
  });
}

export function useGetPrfsIdApp() {
  return useMutation({
    mutationFn: (req: SignInPrfsIdentityRequest) => {
      return idApi({ type: "sign_in_prfs_identity", ...req });
    },
  });
}
