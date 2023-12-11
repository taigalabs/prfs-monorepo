import React from "react";
import { initWasm, makeCredential, type Credential } from "@taigalabs/prfs-crypto-js";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import { useRouter, useSearchParams } from "next/navigation";
import {
  sendMsgToOpener,
  SignInData,
  type SignInSuccessZAuthMsg,
} from "@taigalabs/prfs-id-sdk-web";
import Spinner from "@taigalabs/prfs-react-components/src/spinner/Spinner";
import { encrypt } from "eciesjs";
import { prfsSign } from "@taigalabs/prfs-crypto-js";
import { secp256k1 as secp } from "@noble/curves/secp256k1";

import styles from "./Step2.module.scss";
import { i18nContext } from "@/contexts/i18n";
import {
  PrfsIdSignInInnerPadding,
  PrfsIdSignInInputItem,
  PrfsIdSignInModuleBtnRow,
  PrfsIdSignInModuleHeader,
  PrfsIdSignInModuleInputArea,
  PrfsIdSignInModuleLogoArea,
  PrfsIdSignInModuleSubtitle,
  PrfsIdSignInModuleTitle,
} from "@/components/prfs_id_sign_in_module/PrfsIdSignInModule";
import { IdCreateForm } from "@/functions/validate_id";

enum Step2Status {
  Loading,
  Standby,
}

const SignInInputs: React.FC<SignInInputsProps> = ({ signInData, salt, credential }) => {
  const [elems, setElems] = React.useState<React.ReactNode>(null);
  React.useEffect(() => {
    async function fn() {
      let el = [];
      for (const d of signInData) {
        if (d === SignInData.ID_POSEIDON) {
          const sig = await prfsSign(credential.secret_key, salt);
          const sigHex = sig.toHex();
          console.log(22, sig);

          el.push(
            <li key={d}>
              <p className={styles.label}>{d}</p>
              <p>{salt}</p>
              <p>{salt}</p>
            </li>,
          );
        }
      }
      setElems(el);
    }

    fn().then();
  }, [signInData, setElems]);

  return <ul className={styles.signInData}>{elems}</ul>;
};

const Step2: React.FC<Step2Props> = ({
  formData,
  formErrors,
  setFormData,
  handleClickPrev,
  publicKey,
}) => {
  const i18n = React.useContext(i18nContext);
  const searchParams = useSearchParams();
  const [step2Status, setStep2Status] = React.useState(Step2Status.Loading);
  const [title, setTitle] = React.useState<React.ReactNode>(null);
  const [content, setContent] = React.useState<React.ReactNode>(null);
  const [credential, setCredential] = React.useState<Credential | null>(null);

  React.useEffect(() => {
    async function fn() {
      try {
        const credential = await makeCredential({
          email: formData.email,
          password_1: formData.password_1,
          password_2: formData.password_2,
        });
        setCredential(credential);

        // console.log(11, credential);

        // const MSG = "01".repeat(32);
        // const PRIV_KEY = 0x2n;
        // const sig = secp.sign(MSG, PRIV_KEY as any);
        // console.log(2221, sig);
        // const sig2 = secp.sign(MSG, BigInt(credential.secret_key));

        // console.log(222, sig2);

        const { hostname } = window.location;
        const title = (
          <>
            <span className={styles.blueText}>{hostname}</span> wants you to submit a few additional
            data to sign in
          </>
        );
        setTitle(title);

        const signInData = searchParams.get("sign_in_data");
        if (signInData) {
          const d = decodeURIComponent(signInData);
          const data = d.split(",");

          const content = (
            <SignInInputs signInData={data} salt={hostname} credential={credential} />
          );
          setContent(content);
        }
        setStep2Status(Step2Status.Standby);
      } catch (err) {
        console.error(err);
      }
    }
    fn().then();
  }, [setStep2Status, searchParams, setTitle, setContent, formData, setCredential]);

  const handleClickSignIn = React.useCallback(async () => {
    if (formData && publicKey && credential) {
      const payload = {
        id: credential.id,
        publicKey: credential.public_key,
      };
      const encrypted = encrypt(publicKey, Buffer.from(JSON.stringify(payload)));
      const msg: SignInSuccessZAuthMsg = {
        type: "SIGN_IN_SUCCESS",
        payload: encrypted,
      };

      await sendMsgToOpener(msg);
      window.close();
    }
  }, [searchParams, publicKey, credential]);

  return (
    <>
      {step2Status === Step2Status.Loading && (
        <div className={styles.overlay}>
          <Spinner color="#1b62c0" />
        </div>
      )}
      <div className={styles.topLabelArea}>{i18n.sign_in_with_prfs_id}</div>
      <PrfsIdSignInInnerPadding>
        <PrfsIdSignInModuleHeader>
          <PrfsIdSignInModuleTitle>{title}</PrfsIdSignInModuleTitle>
          {/* <PrfsIdSignInModuleSubtitle>{i18n.use_your_prfs_identity}</PrfsIdSignInModuleSubtitle> */}
        </PrfsIdSignInModuleHeader>
        {content}
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
      </PrfsIdSignInInnerPadding>
    </>
  );
};

export default Step2;

export interface Step2Props {
  formData: IdCreateForm;
  formErrors: IdCreateForm;
  setFormData: React.Dispatch<React.SetStateAction<IdCreateForm>>;
  handleClickPrev: () => void;
  publicKey: string | null;
}

export interface SignInInputsProps {
  signInData: string[];
  salt: string;
  credential: Credential;
}
