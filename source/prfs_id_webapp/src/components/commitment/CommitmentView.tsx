import React from "react";
import { poseidon_2, prfsSign } from "@taigalabs/prfs-crypto-js";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import { useSearchParams } from "next/navigation";
import {
  CommitmentType,
  CommitmentSuccessPayload,
  PrfsIdCredential,
  CommitmentArgs,
  sendMsgToChild,
  newPrfsIdMsg,
  newPrfsIdErrorMsg,
  CommitmentQuery,
} from "@taigalabs/prfs-id-sdk-web";
import Spinner from "@taigalabs/prfs-react-components/src/spinner/Spinner";
import { encrypt } from "@taigalabs/prfs-crypto-js";
import { PrfsIdentitySignInRequest } from "@taigalabs/prfs-entities/bindings/PrfsIdentitySignInRequest";
import { idApi } from "@taigalabs/prfs-api-js";
import { hexlify } from "ethers/lib/utils";
import { useMutation } from "@tanstack/react-query";

import styles from "./CommitmentView.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  DefaultErrorMsg,
  DefaultInnerPadding,
  DefaultModuleBtnRow,
  DefaultModuleHeader,
  DefaultModuleTitle,
  DefaultTopLabel,
} from "@/components/default_module/DefaultModule";
import { CommitmentItem, CommitmentItemList } from "./CommitmentItem";
import { ProofGenReceiptRaw } from "../proof_gen/receipt";

enum Status {
  Loading,
  Standby,
}

const CommitmentView: React.FC<CommitmentViewProps> = ({
  query,
  credential,
  setReceipt,
  // prfsEmbed,
}) => {
  const i18n = React.useContext(i18nContext);
  const searchParams = useSearchParams();
  const [status, setStatus] = React.useState(Status.Loading);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [elem, setElem] = React.useState<React.ReactNode>(null);

  React.useEffect(() => {
    async function fn() {
      try {
        console.log("query", query);
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
          // receipt[name] = hashedHex;

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

  console.log("elem", elem);

  return <>{elem}</>;
};

export default CommitmentView;

export interface CommitmentViewProps {
  // handleClickPrev: () => void;
  credential: PrfsIdCredential;
  // commitmentArgs: CommitmentArgs | null;
  query: CommitmentQuery;
  setReceipt: React.Dispatch<React.SetStateAction<ProofGenReceiptRaw | null>>;
  // prfsEmbed: HTMLIFrameElement | null;
}
