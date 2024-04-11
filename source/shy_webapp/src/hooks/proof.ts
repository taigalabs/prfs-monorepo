import { useMutation } from "@taigalabs/prfs-react-lib/react_query";
import { shyApi2 } from "@taigalabs/shy-api-js";
import { GetShyProofRequest } from "@taigalabs/shy-entities/bindings/GetShyProofRequest";

export function useGetShyProof() {
  return useMutation({
    mutationFn: (req: GetShyProofRequest) => {
      return shyApi2({ type: "get_shy_proof", ...req });
    },
  });
}

export function useJoinShyChannel() {
  return useMutation({
    mutationFn: (req: GetShyProofRequest) => {
      return shyApi2({ type: "get_shy_proof", ...req });
    },
  });
}
