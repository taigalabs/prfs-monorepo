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
} from "@taigalabs/prfs-id-sdk-web";
import Spinner from "@taigalabs/prfs-react-components/src/spinner/Spinner";
import { encrypt } from "eciesjs";
import { PrfsIdentitySignInRequest } from "@taigalabs/prfs-entities/bindings/PrfsIdentitySignInRequest";
import { idApi } from "@taigalabs/prfs-api-js";
import { hexlify } from "ethers/lib/utils";
import { useMutation } from "@tanstack/react-query";

import styles from "./CommitmentView.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  SignInErrorMsg,
  SignInInnerPadding,
  SignInModuleBtnRow,
  SignInModuleHeader,
  SignInModuleTitle,
  SignInWithPrfsId,
} from "@/components/sign_in_module/SignInModule";
import { CommitmentItem, CommitmentItemList } from "./CommitmentItem";

enum Status {
  Loading,
  Standby,
}

const CommitmentView: React.FC<CommitmentViewProps> = ({
  handleClickPrev,
  // appId,
  // publicKey,
  commitmentArgs,
  credential,
  prfsEmbedRef,
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
  const [commitmentElems, setCommitmentElems] = React.useState<React.ReactNode>(null);

  React.useEffect(() => {
    async function fn() {
      try {
        // const cms = searchParams.get("cms");
        // console.log("cms", cms);

        if (commitmentArgs) {
          // const d = decodeURIComponent(cms);

          // let data: CommitmentData[];
          // try {
          //   data = JSON.parse(d);
          // } catch (err) {
          //   console.error("failed to parse cms, obj: %s, err: %s", d, err);
          //   return;
          // }

          let elems = [];
          let receipt: Record<string, string> = {};
          for (const cm of commitmentArgs.cms) {
            const { name, preImage, type } = cm;

            if (type === CommitmentType.SIG_POSEIDON_1) {
              const sig = await prfsSign(credential.secret_key, preImage);
              const sigBytes = sig.toCompactRawBytes();
              const hashed = await poseidon_2(sigBytes);
              const hashedHex = hexlify(hashed);
              // receipt[name] = hashedHex;
              elems.push(
                <CommitmentItem
                  key={name}
                  name={name}
                  val={preImage}
                  type={type}
                  hashedHex={hashedHex}
                />,
              );
            }
          }

          // const listElem = <CommitmentItemList>{elems}</CommitmentItemList>;
          setCommitmentReceipt(receipt);
          setCommitmentElems(elems);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fn().then();
  }, [searchParams, setCommitmentReceipt, setCommitmentElems, commitmentArgs]);

  React.useEffect(() => {
    if (commitmentReceipt) {
      setStatus(Status.Standby);
    }
  }, [setStatus, commitmentReceipt]);

  const handleClickSubmit = React.useCallback(async () => {
    if (commitmentArgs && credential && prfsEmbedRef.current) {
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
        encrypt(commitmentArgs.publicKey, Buffer.from(JSON.stringify(payload))),
      );
      console.log("Encrypted credential", encrypted);

      try {
        await sendMsgToChild(
          newPrfsIdMsg("COMMITMENT_SUCCESS", {
            key: commitmentArgs.publicKey,
            value: encrypted,
          }),
          prfsEmbedRef.current,
        );
        // await sendMsgToOpener(msg);
        // window.close();
      } catch (err: any) {}
    }
  }, [searchParams, commitmentArgs, credential, setErrorMsg, commitmentReceipt]);

  return commitmentArgs ? (
    <>
      {status === Status.Loading && (
        <div className={styles.overlay}>
          <Spinner color="#1b62c0" />
        </div>
      )}
      <SignInWithPrfsId>{i18n.sign_in_with_prfs_id}</SignInWithPrfsId>
      <SignInInnerPadding>
        <SignInModuleHeader noTopPadding>
          <SignInModuleTitle>
            <span className={styles.blueText}>{commitmentArgs.appId}</span> wants you to submit
            commitment (s)
          </SignInModuleTitle>
        </SignInModuleHeader>
        <div className={styles.prfsId}>
          <p>{credential.id}</p>
        </div>
        <CommitmentItemList>{commitmentElems}</CommitmentItemList>
        <div className={styles.dataWarning}>
          <p className={styles.title}>Make sure you trust {commitmentArgs.appId} app</p>
          <p className={styles.desc}>{i18n.app_data_sharing_guide}</p>
        </div>
        <SignInModuleBtnRow className={styles.btnRow}>
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
        </SignInModuleBtnRow>
        <SignInErrorMsg>{errorMsg}</SignInErrorMsg>
      </SignInInnerPadding>
    </>
  ) : (
    <div>Loading...</div>
  );
};

export default CommitmentView;

export interface CommitmentViewProps {
  handleClickPrev: () => void;
  // appId: string;
  // publicKey: string;
  credential: PrfsIdCredential;
  commitmentArgs: CommitmentArgs | null;
  prfsEmbedRef: React.MutableRefObject<HTMLIFrameElement | null>;
}
