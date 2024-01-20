import React from "react";
import { poseidon_2, prfsSign } from "@taigalabs/prfs-crypto-js";
import { useSearchParams } from "next/navigation";
import { CommitmentType, PrfsIdCredential, CommitmentQuery } from "@taigalabs/prfs-id-sdk-web";
import { hexlify } from "ethers/lib/utils";

import styles from "./CommitmentView.module.scss";
import { i18nContext } from "@/i18n/context";
import { CommitmentItem } from "./CommitmentItem";
import { ProofGenReceiptRaw } from "@/components/proof_gen/receipt";

const CommitmentView: React.FC<CommitmentViewProps> = ({ query, credential, setReceipt }) => {
  const searchParams = useSearchParams();
  const [elem, setElem] = React.useState<React.ReactNode>(null);

  React.useEffect(() => {
    async function fn() {
      try {
        const { name, preImage, type } = query;
        if (type === CommitmentType.SIG_POSEIDON_1) {
          const sig = await prfsSign(credential.secret_key, preImage);
          const sigBytes = sig.toCompactRawBytes();
          const hashed = await poseidon_2(sigBytes);
          const hashedHex = hexlify(hashed);
          setReceipt(oldVal => ({
            ...oldVal,
            [name]: hashedHex,
          }));

          setElem(
            <CommitmentItem
              key={name}
              name={name}
              val={preImage}
              type={type}
              hashedHex={hashedHex}
            />,
          );
        }
      } catch (err) {
        console.error(err);
      }
    }
    fn().then();
  }, [searchParams, setElem, query]);

  return <>{elem}</>;
};

export default CommitmentView;

export interface CommitmentViewProps {
  credential: PrfsIdCredential;
  query: CommitmentQuery;
  setReceipt: React.Dispatch<React.SetStateAction<ProofGenReceiptRaw | null>>;
}
