import { paths } from "@/paths";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { useRouter } from "next/navigation";
import React from "react";

export function useSelectProofType() {
  const router = useRouter();

  const handleSelectProofType = React.useCallback(
    async (proofType: PrfsProofType) => {
      router.push(`${paths.create}?proof_type_id=${proofType.proof_type_id}`);
    },
    [router],
  );

  return handleSelectProofType;
}
