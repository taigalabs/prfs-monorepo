import React from "react";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import { useSearchParams } from "next/navigation";
import {
  SignInSuccessPayload,
  PrfsIdCredential,
  AppSignInArgs,
  sendMsgToChild,
  newPrfsIdMsg,
} from "@taigalabs/prfs-id-sdk-web";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { encrypt } from "@taigalabs/prfs-crypto-js";
import { useMutation } from "@tanstack/react-query";
import { PrfsIdentitySignInRequest } from "@taigalabs/prfs-entities/bindings/PrfsIdentitySignInRequest";
import { idApi } from "@taigalabs/prfs-api-js";

import styles from "./AppCredential.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  DefaultErrorMsg,
  DefaultInnerPadding,
  DefaultModuleBtnRow,
  DefaultModuleHeader,
  DefaultModuleTitle,
  DefaultTopLabel,
} from "@/components/default_module/DefaultModule";
import SignInInputs, { PrfsSignInData } from "./SignInInputs";

enum AppCredentialStatus {
  Loading,
  Standby,
}

const AppCredential: React.FC<AppCredentialProps> = ({
  handleClickPrev,
  appSignInArgs,
  credential,
  prfsEmbed,
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
            <span className={styles.blueText}>{appSignInArgs.app_id}</span> wants you to submit a
            few additional data to sign in
          </>
        );
        setTitle(title);

        if (appSignInArgs.sign_in_data.length > 0) {
          const content = (
            <SignInInputs
              signInDataMeta={appSignInArgs.sign_in_data}
              credential={credential}
              appId={appSignInArgs.app_id}
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
    if (appSignInArgs.public_key && credential) {
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

      const payload: SignInSuccessPayload = {
        account_id: signInData.account_id,
        public_key: signInData.public_key,
      };
      const encrypted = JSON.stringify(
        encrypt(appSignInArgs.public_key, Buffer.from(JSON.stringify(payload))),
      );
      // console.log("Encrypted credential", encrypted);

      try {
        if (prfsEmbed) {
          console.log("sending");
          await sendMsgToChild(
            newPrfsIdMsg("SIGN_IN_RESULT", {
              appId: appSignInArgs.app_id,
              value: encrypted,
            }),
            prfsEmbed,
          );
        }
        // window.close();
      } catch (err: any) {
        setErrorMsg(err.toString());
      }
    }
  }, [searchParams, appSignInArgs, credential, setErrorMsg, signInData]);

  return (
    <>
      {appCredentialStatus === AppCredentialStatus.Loading && (
        <div className={styles.overlay}>
          <Spinner color="#1b62c0" />
        </div>
      )}
      <DefaultInnerPadding>
        <div className={styles.main}>
          <DefaultModuleHeader noTopPadding>
            <DefaultModuleTitle>{title}</DefaultModuleTitle>
          </DefaultModuleHeader>
          <div>
            <p className={styles.prfsId}>{credential.id}</p>
          </div>
          {signInDataElem}
          <div className={styles.dataWarning}>
            <p className={styles.title}>Make sure you trust {appSignInArgs.app_id} app</p>
            <p className={styles.desc}>{i18n.app_data_sharing_guide}</p>
          </div>
          <DefaultModuleBtnRow>
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
          </DefaultModuleBtnRow>
          <DefaultErrorMsg>{errorMsg}</DefaultErrorMsg>
        </div>
      </DefaultInnerPadding>
    </>
  );
};

export default AppCredential;

export interface AppCredentialProps {
  handleClickPrev: () => void;
  credential: PrfsIdCredential;
  appSignInArgs: AppSignInArgs;
  prfsEmbed: HTMLIFrameElement | null;
}
