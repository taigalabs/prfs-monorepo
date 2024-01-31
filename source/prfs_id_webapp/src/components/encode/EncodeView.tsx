import React from "react";
import { makeCommitment } from "@taigalabs/prfs-crypto-js";
import { useSearchParams } from "next/navigation";
import {
  CommitmentType,
  PrfsIdCredential,
  CommitmentQuery,
  EncodeQuery,
  EncodeType,
} from "@taigalabs/prfs-id-sdk-web";

import styles from "./EncodeView.module.scss";
// import { CommitmentItem } from "./CommitmentItem";
import { ProofGenReceiptRaw } from "@/components/proof_gen/receipt";

const EncodeView: React.FC<EncodeViewProps> = ({ query, credential, setReceipt }) => {
  const searchParams = useSearchParams();
  const [elem, setElem] = React.useState<React.ReactNode>(null);

  React.useEffect(() => {
    async function fn() {
      try {
        const { name, msg, type } = query;
        if (type === EncodeType.EC_SECP256K1) {
          // const cm = await makeCommitment(credential.secret_key, preImage);
          // setReceipt(oldVal => ({
          //   ...oldVal,
          //   [name]: cm,
          // }));
          // setElem(
          //   <CommitmentItem key={name} name={name} val={preImage} type={type} hashedHex={cm} />,
          // );
          //
          setElem(<div>power</div>);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fn().then();
  }, [searchParams, setElem, query]);

  return <>{elem}</>;
};

export default EncodeView;

export interface EncodeViewProps {
  credential: PrfsIdCredential;
  query: EncodeQuery;
  setReceipt: React.Dispatch<React.SetStateAction<ProofGenReceiptRaw | null>>;
}
