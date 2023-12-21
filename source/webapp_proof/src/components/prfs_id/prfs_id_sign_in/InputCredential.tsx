import React from "react";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import { useRouter } from "next/navigation";
import Spinner from "@taigalabs/prfs-react-components/src/spinner/Spinner";
import { PrfsIdCredential, makePrfsIdCredential } from "@taigalabs/prfs-crypto-js";

import styles from "./InputCredential.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  PrfsIdSignInInnerPadding,
  PrfsIdSignInInputItem,
  PrfsIdSignInModuleBtnRow,
  PrfsIdSignInModuleHeader,
  PrfsIdSignInModuleInputArea,
  PrfsIdSignInModuleLogoArea,
  PrfsIdSignInModuleSubtitle,
  PrfsIdSignInModuleTitle,
} from "@/components/prfs_id/prfs_id_sign_in_module/PrfsIdSignInModule";
import { paths } from "@/paths";
import { IdCreateForm } from "@/functions/validate_id";

enum InputCredentialStatus {
  Loading,
  Standby,
}

const InputCredential: React.FC<InputCredentialProps> = ({
  formData,
  formErrors,
  setFormData,
  handleClickCreateID,
  handleSucceedSignIn,
}) => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();
  const [status, setStatus] = React.useState(InputCredentialStatus.Standby);
  const [title, setTitle] = React.useState(i18n.sign_in);

  React.useEffect(() => {
    const { hostname } = window.location;
    setTitle(`${i18n.sign_in} to ${hostname}`);
  }, [setTitle]);

  // const handleClickCreateID = React.useCallback(() => {
  //   const { search } = window.location;
  //   const url = `${paths.id__create_id}${search}`;
  //   router.push(url);
  // }, [router]);

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

    // setCredential(credential);
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
      <PrfsIdSignInInnerPadding>
        <PrfsIdSignInModuleLogoArea />
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
              handleKeyDown={handleKeyDown}
            />
          </div>
          <div className={styles.inputGroup}>
            <PrfsIdSignInInputItem
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
            <PrfsIdSignInInputItem
              name="password_2"
              value={formData.password_2}
              placeholder={i18n.password_2}
              error={formErrors.password_2}
              handleChangeValue={handleChangeValue}
              handleKeyDown={handleKeyDown}
              type="password"
            />
          </div>
        </PrfsIdSignInModuleInputArea>
        <PrfsIdSignInModuleBtnRow>
          <Button
            variant="transparent_blue_2"
            noTransition
            handleClick={handleClickCreateID}
            type="button"
          >
            {i18n.create_id}
          </Button>
          <Button
            type="button"
            variant="blue_2"
            className={styles.signInBtn}
            noTransition
            handleClick={enhancedHandleClickNext}
            noShadow
          >
            {i18n.next}
          </Button>
        </PrfsIdSignInModuleBtnRow>
      </PrfsIdSignInInnerPadding>
    </>
  );
};

export default InputCredential;

export interface InputCredentialProps {
  errorMsg: string | null;
  formData: IdCreateForm;
  formErrors: IdCreateForm;
  setFormData: React.Dispatch<React.SetStateAction<IdCreateForm>>;
  handleSucceedSignIn: (credential: PrfsIdCredential) => void;
  handleClickCreateID: () => void;
}