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
  ProofGenArgs,
  QueryType,
} from "@taigalabs/prfs-id-sdk-web";
import Spinner from "@taigalabs/prfs-react-components/src/spinner/Spinner";
import { encrypt } from "@taigalabs/prfs-crypto-js";
import { PrfsIdentitySignInRequest } from "@taigalabs/prfs-entities/bindings/PrfsIdentitySignInRequest";
import { idApi } from "@taigalabs/prfs-api-js";
import { hexlify } from "ethers/lib/utils";
import { useMutation } from "@tanstack/react-query";

import styles from "./ProofGenForm.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  DefaultErrorMsg,
  DefaultInnerPadding,
  DefaultModuleBtnRow,
  DefaultModuleHeader,
  DefaultModuleTitle,
  DefaultTopLabel,
} from "@/components/default_module/DefaultModule";
import CommitmentView from "../commitment/CommitmentView";
import CreateProof from "../create_proof/CreateProof";
// import { CommitmentItem, CommitmentItemList } from "./CommitmentItem";

enum Status {
  Loading,
  Standby,
}

const ProofGenForm: React.FC<ProofGenFormProps> = ({
  handleClickPrev,
  proofGenArgs,
  credential,
  prfsEmbed,
}) => {
  const i18n = React.useContext(i18nContext);
  const searchParams = useSearchParams();
  const [status, setStatus] = React.useState(Status.Loading);
  const [errorMsg, setErrorMsg] = React.useState("");
  const { mutateAsync: prfsIdentitySignInRequest } = useMutation({
    mutationFn: (req: PrfsIdentitySignInRequest) => {
      return idApi("sign_in_prfs_identity", req);
    },
  });
  const [commitmentReceipt, setCommitmentReceipt] = React.useState<Record<string, string> | null>(
    null,
  );
  const [queryElems, setQueryElems] = React.useState<React.ReactNode>(null);

  React.useEffect(() => {
    async function fn() {
      try {
        if (proofGenArgs) {
          let elems = [];
          let receipt: Record<string, string> = {};
          for (const query of proofGenArgs.queries) {
            switch (query.queryType) {
              case QueryType.CREATE_PROOF_TYPE: {
                const elem = <CreateProof key={query.name} credential={credential} query={query} />;
                elems.push(elem);
                break;
              }
              case QueryType.COMMITMENT_TYPE: {
                console.log("cm type");
                const elem = (
                  <CommitmentView key={query.name} credential={credential} query={query} />
                );
                elems.push(elem);
                break;
              }
              default:
                console.error("unsupported query type", query);
                return;
            }
          }

          // for (const cm of commitmentArgs.cms) {
          //   const { name, preImage, type } = cm;

          //   if (type === CommitmentType.SIG_POSEIDON_1) {
          //     const sig = await prfsSign(credential.secret_key, preImage);
          //     const sigBytes = sig.toCompactRawBytes();
          //     const hashed = await poseidon_2(sigBytes);
          //     const hashedHex = hexlify(hashed);
          //     receipt[name] = hashedHex;
          //     elems.push(
          //       null,
          //       // <CommitmentItem
          //       //   key={name}
          //       //   name={name}
          //       //   val={preImage}
          //       //   type={type}
          //       //   hashedHex={hashedHex}
          //       // />,
          //     );
          //   }
          // }

          setCommitmentReceipt(receipt);
          setQueryElems(elems);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fn().then();
  }, [searchParams, setCommitmentReceipt, setQueryElems, proofGenArgs]);

  React.useEffect(() => {
    if (commitmentReceipt) {
      setStatus(Status.Standby);
    }
  }, [setStatus, commitmentReceipt]);

  const handleClickSubmit = React.useCallback(async () => {
    if (proofGenArgs && credential && prfsEmbed) {
      const { payload: _signInRequestPayload, error } = await prfsIdentitySignInRequest({
        identity_id: credential.id,
      });

      if (error) {
        setErrorMsg(error);
        return;
      }

      if (!commitmentReceipt) {
        setErrorMsg("no commitment receipt");
        return;
      }

      const payload: CommitmentSuccessPayload = {
        receipt: commitmentReceipt,
      };
      const encrypted = JSON.stringify(
        encrypt(proofGenArgs.publicKey, Buffer.from(JSON.stringify(payload))),
      );
      console.log("receipt: %o, encrypted", commitmentReceipt, encrypted);

      try {
        await sendMsgToChild(
          newPrfsIdMsg("PROOF_GEN_SUCCESS", {
            appId: proofGenArgs.appId,
            key: proofGenArgs.publicKey,
            value: encrypted,
          }),
          prfsEmbed,
        );
      } catch (err: any) {
        await sendMsgToChild(newPrfsIdErrorMsg("ERROR", err.toString()), prfsEmbed);
        console.error(err);
      }
      window.close();
    }
  }, [searchParams, proofGenArgs, credential, setErrorMsg, commitmentReceipt]);

  return proofGenArgs ? (
    <>
      {status === Status.Loading && (
        <div className={styles.overlay}>
          <Spinner color="#1b62c0" />
        </div>
      )}
      <DefaultTopLabel>{i18n.sign_in_with_prfs_id}</DefaultTopLabel>
      <DefaultInnerPadding>
        <DefaultModuleHeader noTopPadding>
          <DefaultModuleTitle>
            <span className={styles.blueText}>{proofGenArgs.appId}</span> wants you to submit
            information
          </DefaultModuleTitle>
        </DefaultModuleHeader>
        <div className={styles.prfsId}>
          <p>{credential.id}</p>
        </div>
        <div className={styles.queryItemList}>{queryElems}</div>
        <div className={styles.dataWarning}>
          <p className={styles.title}>Make sure you trust {proofGenArgs.appId} app</p>
          <p className={styles.desc}>{i18n.app_data_sharing_guide}</p>
        </div>
        <DefaultModuleBtnRow className={styles.btnRow}>
          <Button variant="transparent_blue_2" noTransition handleClick={handleClickPrev}>
            {i18n.go_back}
          </Button>
          <Button
            type="button"
            variant="blue_2"
            className={styles.signInBtn}
            noTransition
            handleClick={handleClickSubmit}
            noShadow
          >
            {i18n.submit}
          </Button>
        </DefaultModuleBtnRow>
        <DefaultErrorMsg>{errorMsg}</DefaultErrorMsg>
      </DefaultInnerPadding>
    </>
  ) : (
    <div>Loading...</div>
  );
};

export default ProofGenForm;

export interface ProofGenFormProps {
  handleClickPrev: () => void;
  credential: PrfsIdCredential;
  proofGenArgs: ProofGenArgs | null;
  prfsEmbed: HTMLIFrameElement | null;
}
