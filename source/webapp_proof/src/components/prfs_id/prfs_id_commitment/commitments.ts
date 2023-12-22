import React from "react";
import { useSearchParams } from "next/navigation";
import { CommitmentData, CommitmentType } from "@taigalabs/prfs-id-sdk-web";
import { PrfsIdCredential, poseidon_2, prfsSign } from "@taigalabs/prfs-crypto-js";
import { hexlify } from "ethers/lib/utils";

export function useCommitments({ credential }: UseCommitmentsArgs) {
  const searchParams = useSearchParams();
  const [commitmentData, setCommitmentData] = React.useState<CommitmentData>({});
  const [commitmentReceipt, setCommitmentReceipt] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    async function fn() {
      try {
        const cms = searchParams.get("cms");
        console.log("cms", cms);

        if (cms) {
          const d = decodeURIComponent(cms);

          let commitmentData: CommitmentData;
          try {
            commitmentData = JSON.parse(d);
          } catch (err) {
            console.error("failed to parse cms, obj: %s, err: %s", d, err);
            return;
          }
          setCommitmentData(commitmentData);
          let receipt: Record<string, string> = {};

          for (const key in commitmentData) {
            const { val, type } = commitmentData[key];

            if (type === CommitmentType.SIG_POSEIDON_1) {
              const sig = await prfsSign(credential.secret_key, val);
              const sigBytes = sig.toCompactRawBytes();
              const hashed = await poseidon_2(sigBytes);
              const hashedHex = hexlify(hashed);
              receipt[key] = hashedHex;
            }
          }

          setCommitmentReceipt(receipt);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fn().then();
  }, [searchParams, setCommitmentData, setCommitmentReceipt]);

  return {
    commitmentData,
    commitmentReceipt,
  };
}

export interface UseCommitmentsArgs {
  credential: PrfsIdCredential;
}
