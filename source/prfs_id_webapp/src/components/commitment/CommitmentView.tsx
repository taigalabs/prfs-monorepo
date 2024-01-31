import React from "react";
import { makeCommitment } from "@taigalabs/prfs-crypto-js";
import { useSearchParams } from "next/navigation";
import { CommitmentType, PrfsIdCredential, CommitmentQuery } from "@taigalabs/prfs-id-sdk-web";

import styles from "./CommitmentView.module.scss";
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
          const cm = await makeCommitment(credential.secret_key, preImage);
          setReceipt(oldVal => ({
            ...oldVal,
            [name]: cm,
          }));

          setElem(
            <CommitmentItem key={name} name={name} val={preImage} type={type} hashedHex={cm} />,
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
