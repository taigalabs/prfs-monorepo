import React from "react";
import {
  prfsSign,
  makeCredential,
  type Credential,
  poseidon,
  poseidon_2,
} from "@taigalabs/prfs-crypto-js";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import { useRouter, useSearchParams } from "next/navigation";
import {
  PrfsIdSignInSuccessPayload,
  sendMsgToOpener,
  SignInData,
  type PrfsIdSignInSuccessMsg,
  StoredCredential,
  persistPrfsIdCredential,
} from "@taigalabs/prfs-id-sdk-web";
import Spinner from "@taigalabs/prfs-react-components/src/spinner/Spinner";
import { encrypt } from "eciesjs";
import { secp256k1 as secp } from "@noble/curves/secp256k1";

import styles from "./Step2.module.scss";
import { i18nContext } from "@/contexts/i18n";
import {
  PrfsIdSignInInnerPadding,
  PrfsIdSignInModuleBtnRow,
  PrfsIdSignInModuleHeader,
  PrfsIdSignInModuleInputArea,
  PrfsIdSignInModuleLogoArea,
  PrfsIdSignInModuleSubtitle,
  PrfsIdSignInModuleTitle,
} from "@/components/prfs_id_sign_in_module/PrfsIdSignInModule";
import { IdCreateForm } from "@/functions/validate_id";
import { hexlify } from "ethers/lib/utils";

enum Step2Status {
  Loading,
  Standby,
}

const SignInInputs: React.FC<SignInInputsProps> = ({ signInData, credential, appId }) => {
  const [elems, setElems] = React.useState<React.ReactNode>(null);
  React.useEffect(() => {
    async function fn() {
      let el = [];
      for (const d of signInData) {
        if (d === SignInData.ID_POSEIDON) {
          const sig = await prfsSign(credential.secret_key, appId);
          const sigBytes = sig.toCompactRawBytes();
          const sigHash = await poseidon_2(sigBytes);
          const id = sigHash.subarray(0, 20);
          const idHash = hexlify(id);

          el.push(
            <li className={styles.item} key={d}>
              <p className={styles.label}>{d}</p>
              <p>{appId}</p>
              <p>{idHash}</p>
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
  appId,
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
          const content = <SignInInputs signInData={data} credential={credential} appId={appId} />;
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
      const payload: PrfsIdSignInSuccessPayload = {
        id: credential.id,
        publicKey: credential.public_key,
      };
      const encrypted = encrypt(publicKey, Buffer.from(JSON.stringify(payload)));
      const msg: PrfsIdSignInSuccessMsg = {
        type: "SIGN_IN_SUCCESS",
        payload: encrypted,
      };

      console.log(credential.encrypt_key);
      const encryptedCredential = encrypt(
        credential.encrypt_key,
        Buffer.from(JSON.stringify(credential)),
      );
      const credentialToStore: StoredCredential = {
        id: credential.id,
        credential: encryptedCredential,
      };
      persistPrfsIdCredential(credentialToStore);

      await sendMsgToOpener(msg);
      // window.close();
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
        <PrfsIdSignInModuleHeader noTopPadding>
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
  appId: string;
  publicKey: string;
}

export interface SignInInputsProps {
  signInData: string[];
  credential: Credential;
  appId: string;
}
