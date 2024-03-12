import React from "react";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { PrfsIdCredential, makePrfsIdCredential } from "@taigalabs/prfs-id-sdk-web";

import styles from "./SignInForm.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  DefaultInnerPadding,
  DefaultInputItem,
  DefaultModuleBtnRow,
  DefaultModuleHeader,
  DefaultModuleInputArea,
  DefaultModuleLogoArea,
  DefaultModuleSubtitle,
  DefaultModuleTitle,
} from "@/components/default_module/DefaultModule";
import { IdCreateForm } from "@/functions/validate_id";
import { persistPrfsIdCredentialEncrypted } from "@/storage/prfs_id_credential";
import { persistEphemeralPrfsIdCredential } from "@/storage/ephe_credential";

enum InputCredentialStatus {
  Loading,
  Standby,
}

const SignInForm: React.FC<InputCredentialProps> = ({
  formData,
  formErrors,
  setFormData,
  handleClickCreateID,
  handleSucceedSignIn,
  handleClickStoredCredential,
}) => {
  const i18n = React.useContext(i18nContext);
  const [status, setStatus] = React.useState(InputCredentialStatus.Standby);
  const [title, setTitle] = React.useState(i18n.sign_in);

  React.useEffect(() => {
    const { hostname } = window.location;
    setTitle(`${i18n.sign_in} to ${hostname}`);
  }, [setTitle]);

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

  const enhancedHandleClickNext = React.useCallback(async () => {
    const credential = await makePrfsIdCredential({
      email: formData.email,
      password_1: formData.password_1,
      password_2: formData.password_2,
    });
    // console.log("credential", credential, formData);

    persistPrfsIdCredentialEncrypted(credential);
    persistEphemeralPrfsIdCredential(credential);
    handleSucceedSignIn(credential);
  }, [handleSucceedSignIn, formData]);

  const handleKeyDown = React.useCallback(
    async (e: React.KeyboardEvent) => {
      if (e.code === "Enter") {
        e.preventDefault();
        enhancedHandleClickNext();
      }
    },
    [enhancedHandleClickNext],
  );

  return (
    <>
      {status === InputCredentialStatus.Loading && (
        <div className={styles.overlay}>
          <Spinner color="#1b62c0" />
        </div>
      )}
      <DefaultInnerPadding>
        <div className={styles.main}>
          <DefaultModuleLogoArea />
          <DefaultModuleHeader noSidePadding>
            <DefaultModuleTitle>{title}</DefaultModuleTitle>
            <DefaultModuleSubtitle>{i18n.use_your_prfs_identity}</DefaultModuleSubtitle>
          </DefaultModuleHeader>
          <DefaultModuleInputArea>
            <div className={styles.inputGroup}>
              <DefaultInputItem
                name="email"
                value={formData.email}
                placeholder={i18n.email}
                error={formErrors.email}
                handleChangeValue={handleChangeValue}
                handleKeyDown={handleKeyDown}
              />
            </div>
            <div className={styles.inputGroup}>
              <DefaultInputItem
                name="password_1"
                value={formData.password_1}
                placeholder={i18n.password_1}
                error={formErrors.password_1}
                handleChangeValue={handleChangeValue}
                handleKeyDown={handleKeyDown}
                type="password"
              />
            </div>
            <div className={styles.inputGroup}>
              <DefaultInputItem
                name="password_2"
                value={formData.password_2}
                placeholder={i18n.password_2}
                error={formErrors.password_2}
                handleChangeValue={handleChangeValue}
                handleKeyDown={handleKeyDown}
                type="password"
              />
            </div>
          </DefaultModuleInputArea>
          <p className={styles.guide}>
            Signed in before? Check out{" "}
            <span className={styles.blue} onClick={handleClickStoredCredential}>
              stored credentials
            </span>
          </p>
          <DefaultModuleBtnRow noSidePadding>
            <Button
              variant="transparent_blue_3"
              noTransition
              handleClick={handleClickCreateID}
              type="button"
              rounded
            >
              {i18n.create_id}
            </Button>
            <Button
              type="button"
              variant="blue_3"
              className={styles.signInBtn}
              noTransition
              handleClick={enhancedHandleClickNext}
              noShadow
            >
              {i18n.next}
            </Button>
          </DefaultModuleBtnRow>
        </div>
      </DefaultInnerPadding>
    </>
  );
};

export default SignInForm;

export interface InputCredentialProps {
  errorMsg: string | null;
  formData: IdCreateForm;
  formErrors: IdCreateForm;
  setFormData: React.Dispatch<React.SetStateAction<IdCreateForm>>;
  handleSucceedSignIn: (credential: PrfsIdCredential) => void;
  handleClickCreateID: () => void;
  handleClickStoredCredential: () => void;
}
