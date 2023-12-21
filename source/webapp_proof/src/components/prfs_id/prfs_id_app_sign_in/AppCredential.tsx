import React from "react";
import { type PrfsIdCredential } from "@taigalabs/prfs-crypto-js";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import { useSearchParams } from "next/navigation";
import {
  PrfsIdSignInSuccessPayload,
  sendMsgToOpener,
  type PrfsIdSignInSuccessMsg,
  StoredCredential,
  persistPrfsIdCredential,
} from "@taigalabs/prfs-id-sdk-web";
import Spinner from "@taigalabs/prfs-react-components/src/spinner/Spinner";
import { encrypt } from "eciesjs";
import { useMutation } from "wagmi";
import { PrfsIdentitySignInRequest } from "@taigalabs/prfs-entities/bindings/PrfsIdentitySignInRequest";
import { idApi } from "@taigalabs/prfs-api-js";

import styles from "./AppCredential.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  PrfsIdSignInErrorMsg,
  PrfsIdSignInInnerPadding,
  PrfsIdSignInModuleBtnRow,
  PrfsIdSignInModuleHeader,
  PrfsIdSignInModuleTitle,
  PrfsIdSignInWithPrfsId,
} from "@/components/prfs_id/prfs_id_sign_in_module/PrfsIdSignInModule";
import SignInInputs, { PrfsSignInData } from "./SignInInputs";

enum AppCredentialStatus {
  Loading,
  Standby,
}

const AppCredential: React.FC<AppCredentialProps> = ({
  handleClickPrev,
  appId,
  publicKey,
  credential,
}) => {
  const i18n = React.useContext(i18nContext);
  const searchParams = useSearchParams();
  const [appCredentialStatus, setAppCredentialStatus] = React.useState(AppCredentialStatus.Loading);
  const [title, setTitle] = React.useState<React.ReactNode>(null);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [signInDataElem, setSignInDataElem] = React.useState<React.ReactNode>(null);
  const [signInData, setSignInData] = React.useState<PrfsSignInData | null>(null);
  const { mutateAsync: prfsIdentitySignInRequest } = useMutation({
    mutationFn: (req: PrfsIdentitySignInRequest) => {
      return idApi("sign_in_prfs_identity", req);
    },
  });

  React.useEffect(() => {
    async function fn() {
      try {
        console.log("credential", credential);
        const title = (
          <>
            <span className={styles.blueText}>{appId}</span> wants you to submit a few additional
            data to sign in
          </>
        );
        setTitle(title);

        const signInData = searchParams.get("sign_in_data");
        if (signInData) {
          const d = decodeURIComponent(signInData);
          const data = d.split(",");
          const content = (
            <SignInInputs
              signInDataMeta={data}
              credential={credential}
              appId={appId}
              setSignInData={setSignInData}
            />
          );
          setSignInDataElem(content);
        }
        setAppCredentialStatus(AppCredentialStatus.Standby);
      } catch (err) {
        console.error(err);
      }
    }
    fn().then();
  }, [
    setAppCredentialStatus,
    searchParams,
    setTitle,
    setSignInData,
    setSignInDataElem,
    credential,
  ]);

  const handleClickSignIn = React.useCallback(async () => {
    if (publicKey && credential) {
      const { payload: _signInRequestPayload, error } = await prfsIdentitySignInRequest({
        identity_id: credential.id,
      });

      if (error) {
        setErrorMsg(error);
        return;
      }

      if (!signInData) {
        setErrorMsg("no sign in data");
        return;
      }

      const payload: PrfsIdSignInSuccessPayload = {
        account_id: signInData.account_id,
        public_key: signInData.public_key,
      };
      const encrypted = encrypt(publicKey, Buffer.from(JSON.stringify(payload)));
      console.log("Encrypted credential", encrypted);
      const msg: PrfsIdSignInSuccessMsg = {
        type: "SIGN_IN_SUCCESS",
        payload: encrypted,
      };
      const encryptedCredential = encrypt(
        credential.encrypt_key,
        Buffer.from(JSON.stringify(credential)),
      );
      let credentialArr = Array.prototype.slice.call(encryptedCredential);
      const credentialToStore: StoredCredential = {
        id: credential.id,
        credential: credentialArr,
      };
      persistPrfsIdCredential(credentialToStore);

      await sendMsgToOpener(msg);
      window.close();
    }
  }, [searchParams, publicKey, credential, setErrorMsg, signInData]);

  return (
    <>
      {appCredentialStatus === AppCredentialStatus.Loading && (
        <div className={styles.overlay}>
          <Spinner color="#1b62c0" />
        </div>
      )}
      <PrfsIdSignInWithPrfsId>{i18n.sign_in_with_prfs_id}</PrfsIdSignInWithPrfsId>
      <PrfsIdSignInInnerPadding>
        <PrfsIdSignInModuleHeader noTopPadding>
          <PrfsIdSignInModuleTitle>{title}</PrfsIdSignInModuleTitle>
        </PrfsIdSignInModuleHeader>
        <div>
          <p className={styles.prfsId}>{credential.id}</p>
        </div>
        {signInDataElem}
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
            handleClick={handleClickSignIn}
            noShadow
          >
            {i18n.sign_in}
          </Button>
        </PrfsIdSignInModuleBtnRow>
        <PrfsIdSignInErrorMsg>{errorMsg}</PrfsIdSignInErrorMsg>
      </PrfsIdSignInInnerPadding>
    </>
  );
};

export default AppCredential;

export interface AppCredentialProps {
  handleClickPrev: () => void;
  appId: string;
  publicKey: string;
  credential: PrfsIdCredential;
}
