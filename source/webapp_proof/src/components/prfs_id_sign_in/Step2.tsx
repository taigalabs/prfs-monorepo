import React from "react";
import { initWasm, makeCredential } from "@taigalabs/prfs-crypto-js";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import { useRouter, useSearchParams } from "next/navigation";
import { sendMsgToOpener, type SignInSuccessZAuthMsg } from "@taigalabs/prfs-id-sdk-web";
import Spinner from "@taigalabs/prfs-react-components/src/spinner/Spinner";
import { encrypt } from "eciesjs";

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

const Step2: React.FC<Step2Props> = ({
  formData,
  formErrors,
  setFormData,
  title,
  handleClickPrev,
  publicKey,
}) => {
  const i18n = React.useContext(i18nContext);
  const searchParams = useSearchParams();
  const [step2Status, setStep2Status] = React.useState(Step2Status.Loading);

  React.useEffect(() => {
    const signInData = searchParams.get("sign_in_data");
    setStep2Status(Step2Status.Standby);

    if (signInData) {
      const d = decodeURIComponent(signInData);
      console.log(11, d);
    }
  }, [setStep2Status, searchParams]);

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
      <div className={styles.topLabelArea}>{i18n.sign_in_with_prfs_id}</div>
      <PrfsIdSignInInnerPadding>
        <PrfsIdSignInModuleHeader>
          <PrfsIdSignInModuleTitle>{title}</PrfsIdSignInModuleTitle>
          <PrfsIdSignInModuleSubtitle>{i18n.use_your_prfs_identity}</PrfsIdSignInModuleSubtitle>
        </PrfsIdSignInModuleHeader>
        <PrfsIdSignInModuleInputArea>
          <div className={styles.inputGroup}>
            <PrfsIdSignInInputItem
              name="email"
              value={formData.email}
              placeholder={i18n.email}
              error={formErrors.email}
              handleChangeValue={handleChangeValue}
            />
          </div>
          <div className={styles.inputGroup}>
            <PrfsIdSignInInputItem
              name="password_1"
              value={formData.password_1}
              placeholder={i18n.password_1}
              error={formErrors.password_1}
              handleChangeValue={handleChangeValue}
              type="password"
            />
          </div>
          <div className={styles.inputGroup}>
            <PrfsIdSignInInputItem
              name="password_2"
              value={formData.password_2}
              placeholder={i18n.password_2}
              error={formErrors.password_2}
              handleChangeValue={handleChangeValue}
              type="password"
            />
          </div>
        </PrfsIdSignInModuleInputArea>
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
  title: string;
  formData: IdCreateForm;
  formErrors: IdCreateForm;
  setFormData: React.Dispatch<React.SetStateAction<IdCreateForm>>;
  handleClickPrev: () => void;
  publicKey: string | null;
}
