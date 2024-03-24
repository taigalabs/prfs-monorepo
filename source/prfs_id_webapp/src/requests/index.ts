import { idApi } from "@taigalabs/prfs-api-js";
import { GetPrfsIdAppRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsIdAppRequest";
import { SignInPrfsIdentityRequest } from "@taigalabs/prfs-entities/bindings/SignInPrfsIdentityRequest";
import { useMutation, useQuery } from "@taigalabs/prfs-react-lib/react_query";

export function useSignInPrfsIdentity() {
  return useMutation({
    mutationFn: (req: SignInPrfsIdentityRequest) => {
      return idApi({ type: "sign_in_prfs_identity", ...req });
    },
  });
}

export function useGetPrfsIdApp(appId: string | undefined) {
  return useQuery({
    queryKey: ["get_prfs_id_app"],
    queryFn: async () => {
      return idApi({ type: "get_prfs_id_app", app_id: appId });
    },
    enabled: !!appId,
  });
}
