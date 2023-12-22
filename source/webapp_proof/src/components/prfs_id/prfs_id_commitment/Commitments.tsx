import React from "react";
import { prfsSign, type PrfsIdCredential, poseidon_2 } from "@taigalabs/prfs-crypto-js";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import { useSearchParams } from "next/navigation";
import {
  PrfsIdSignInSuccessPayload,
  sendMsgToOpener,
  type PrfsIdSignInSuccessMsg,
  StoredCredential,
  persistPrfsIdCredential,
  CommitmentData,
  CommitmentType,
} from "@taigalabs/prfs-id-sdk-web";
import Spinner from "@taigalabs/prfs-react-components/src/spinner/Spinner";
import { encrypt } from "eciesjs";
import { PrfsIdentitySignInRequest } from "@taigalabs/prfs-entities/bindings/PrfsIdentitySignInRequest";
import { idApi } from "@taigalabs/prfs-api-js";
import { hexlify } from "ethers/lib/utils";
import { useMutation } from "@tanstack/react-query";

import styles from "./Commitments.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  PrfsIdSignInErrorMsg,
  PrfsIdSignInInnerPadding,
  PrfsIdSignInModuleBtnRow,
  PrfsIdSignInModuleHeader,
  PrfsIdSignInModuleTitle,
  PrfsIdSignInWithPrfsId,
} from "@/components/prfs_id/prfs_id_sign_in_module/PrfsIdSignInModule";
import { CommitmentViewItem, CommitmentViewList } from "./CommitmentView";

enum Status {
  Loading,
  Standby,
}

const Commitments: React.FC<CommitmentsProps> = ({
  handleClickPrev,
  appId,
  publicKey,
  credential,
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
  const [commitmentViewElem, setCommitmentViewElem] = React.useState<React.ReactNode>(null);

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

          let elems = [];
          let receipt: Record<string, string> = {};
          for (const name in commitmentData) {
            const { val, type } = commitmentData[name];

            if (type === CommitmentType.SIG_POSEIDON_1) {
              const sig = await prfsSign(credential.secret_key, val);
              const sigBytes = sig.toCompactRawBytes();
              const hashed = await poseidon_2(sigBytes);
              const hashedHex = hexlify(hashed);
              receipt[name] = hashedHex;
              elems.push(
                <CommitmentViewItem
                  key={name}
                  name={name}
                  val={val}
                  type={type}
                  hashedHex={hashedHex}
                />,
              );
            }
          }

          const listElem = <CommitmentViewList>{elems}</CommitmentViewList>;
          setCommitmentReceipt(receipt);
          setCommitmentViewElem(listElem);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fn().then();
  }, [searchParams, setCommitmentReceipt, setCommitmentViewElem]);

  React.useEffect(() => {
    if (commitmentReceipt) {
      setStatus(Status.Standby);
    }
  }, [setStatus, commitmentReceipt]);

  const handleClickSubmit = React.useCallback(async () => {
    if (publicKey && credential) {
      const { payload: _signInRequestPayload, error } = await prfsIdentitySignInRequest({
        identity_id: credential.id,
      });

      if (error) {
        setErrorMsg(error);
        return;
      }

      // if (!signInData) {
      //   setErrorMsg("no sign in data");
      //   return;
      // }

      // const payload: PrfsIdSignInSuccessPayload = {
      //   account_id: signInData.account_id,
      //   public_key: signInData.public_key,
      // };
      // const encrypted = encrypt(publicKey, Buffer.from(JSON.stringify(payload)));
      // console.log("Encrypted credential", encrypted);
      // const msg: PrfsIdSignInSuccessMsg = {
      //   type: "SIGN_IN_SUCCESS",
      //   payload: encrypted,
      // };
      // const encryptedCredential = encrypt(
      //   credential.encrypt_key,
      //   Buffer.from(JSON.stringify(credential)),
      // );
      // let credentialArr = Array.prototype.slice.call(encryptedCredential);
      // const credentialToStore: StoredCredential = {
      //   id: credential.id,
      //   credential: credentialArr,
      // };
      // persistPrfsIdCredential(credentialToStore);

      // await sendMsgToOpener(msg);
      // window.close();
    }
  }, [searchParams, publicKey, credential, setErrorMsg]);

  return (
    <>
      {status === Status.Loading && (
        <div className={styles.overlay}>
          <Spinner color="#1b62c0" />
        </div>
      )}
      <PrfsIdSignInWithPrfsId>{i18n.sign_in_with_prfs_id}</PrfsIdSignInWithPrfsId>
      <PrfsIdSignInInnerPadding>
        <PrfsIdSignInModuleHeader noTopPadding>
          <PrfsIdSignInModuleTitle>
            <span className={styles.blueText}>{appId}</span> wants you to submit commitment (s)
          </PrfsIdSignInModuleTitle>
        </PrfsIdSignInModuleHeader>
        <div>
          <p className={styles.prfsId}>{credential.id}</p>
        </div>
        {commitmentViewElem}
        <div className={styles.dataWarning}>
          <p className={styles.title}>Make sure you trust {appId} app</p>
          <p className={styles.desc}>{i18n.app_data_sharing_guide}</p>
        </div>
        <PrfsIdSignInModuleBtnRow>
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
        </PrfsIdSignInModuleBtnRow>
        <PrfsIdSignInErrorMsg>{errorMsg}</PrfsIdSignInErrorMsg>
      </PrfsIdSignInInnerPadding>
    </>
  );
};

export default Commitments;

export interface CommitmentsProps {
  handleClickPrev: () => void;
  appId: string;
  publicKey: string;
  credential: PrfsIdCredential;
}
