import React from "react";
import { initWasm, makeCredential } from "@taigalabs/prfs-crypto-js";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { sendMsgToOpener, type SignInSuccessZAuthMsg } from "@taigalabs/prfs-id-sdk-web";
import Spinner from "@taigalabs/prfs-react-components/src/spinner/Spinner";
import { encrypt, decrypt, PrivateKey, PublicKey } from "eciesjs";

import styles from "./Step1.module.scss";
import { i18nContext } from "@/contexts/i18n";
import {
  SignInInputItem,
  SignInModuleBtnRow,
  SignInModuleHeader,
  SignInModuleInputArea,
  SignInModuleLogoArea,
  SignInModuleSubtitle,
  SignInModuleTitle,
} from "@/components/sign_in_module/SignInModule";
import { paths } from "@/paths";
import { IdCreateForm } from "@/functions/validate_id";
import ErrorDialog from "./ErrorDialog";

enum Step2Status {
  Loading,
  Standby,
}

const Step2: React.FC<Step2Props> = ({
  formData,
  formErrors,
  setFormData,
  title,
  errorMsg,
  handleClickNext,
}) => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();
  const [publicKey, setPublicKey] = React.useState<string | null>(null);
  const searchParams = useSearchParams();
  const [step2Status, setStep2Status] = React.useState(Step2Status.Loading);

  const handleClickSignIn = React.useCallback(async () => {
    if (formData && publicKey) {
      const credential = await makeCredential({
        email: formData.email,
        password_1: formData.password_1,
        password_2: formData.password_2,
      });

      console.log("credential", credential);

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
  }, [searchParams, publicKey]);

  const handleClickCreateID = React.useCallback(() => {
    const { search } = window.location;
    const url = `${paths.id__create}${search}`;
    router.push(url);
  }, [router]);

  const handleCloseErrorDialog = React.useCallback(() => {
    window.close();
  }, []);

  const handleChangeValue = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      const name = ev.target.name;
      const val = ev.target.value;

      if (name) {
        setFormData(oldVal => {
          return {
            ...oldVal,
            [name]: val,
          };
        });
      }
    },
    [formData, setFormData],
  );

  return (
    <>
      {step2Status === Step2Status.Loading && (
        <div className={styles.overlay}>
          <Spinner color="#1b62c0" />
        </div>
      )}
      <SignInModuleLogoArea />
      <SignInModuleHeader>
        <SignInModuleTitle>{title}</SignInModuleTitle>
        <SignInModuleSubtitle>{i18n.use_your_prfs_identity}</SignInModuleSubtitle>
      </SignInModuleHeader>
      <SignInModuleInputArea>
        <div className={styles.inputGroup}>
          <SignInInputItem
            name="email"
            value={formData.email}
            placeholder={i18n.email}
            error={formErrors.email}
            handleChangeValue={handleChangeValue}
          />
        </div>
        <div className={styles.inputGroup}>
          <SignInInputItem
            name="password_1"
            value={formData.password_1}
            placeholder={i18n.password_1}
            error={formErrors.password_1}
            handleChangeValue={handleChangeValue}
            type="password"
          />
        </div>
        <div className={styles.inputGroup}>
          <SignInInputItem
            name="password_2"
            value={formData.password_2}
            placeholder={i18n.password_2}
            error={formErrors.password_2}
            handleChangeValue={handleChangeValue}
            type="password"
          />
        </div>
      </SignInModuleInputArea>
      <SignInModuleBtnRow>
        <Button variant="transparent_blue_2" noTransition handleClick={handleClickCreateID}>
          {i18n.create_id}
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
      </SignInModuleBtnRow>
    </>
  );
};

export default Step2;

export interface Step2Props {
  errorMsg: string | null;
  title: string;
  formData: IdCreateForm;
  formErrors: IdCreateForm;
  setFormData: React.Dispatch<React.SetStateAction<IdCreateForm>>;
  handleClickNext: () => void;
}
