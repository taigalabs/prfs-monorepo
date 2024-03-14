import React from "react";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import Input from "@taigalabs/prfs-react-lib/src/input/Input";
import { PrfsIdCredential, makePrfsIdCredential } from "@taigalabs/prfs-id-sdk-web";

import styles from "./SignInForm.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  DefaultInnerPadding,
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
import { useMutation } from "@taigalabs/prfs-react-lib/react_query";
import { prfsApi3 } from "@taigalabs/prfs-api-js";
import { PrfsSignInRequest } from "@taigalabs/prfs-entities/bindings/PrfsSignInRequest";
import prfs_api_error_codes from "@taigalabs/prfs-api-error-codes";
import { useAppDispatch } from "@/state/hooks";
import { setGlobalError } from "@/state/globalErrorReducer";

enum InputCredentialStatus {
  Loading,
  Standby,
}

const EMAIL = "email";
const PASSWORD_1 = "password_1";
const PASSWORD_2 = "password_2";

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
  const dispatch = useAppDispatch();
  const { mutateAsync: prfsSignInRequest } = useMutation({
    mutationFn: (req: PrfsSignInRequest) => {
      return prfsApi3({ type: "sign_in_prfs_account", ...req });
    },
  });

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
      email: formData[EMAIL],
      password_1: formData[PASSWORD_1],
      password_2: formData[PASSWORD_2],
    });

    const { code } = await prfsSignInRequest({ account_id: credential.id });
    if (code === prfs_api_error_codes.CANNOT_FIND_USER.code) {
      dispatch(
        setGlobalError({
          message: `Cannot find the id. Have you signed up before? id: ${credential.id}`,
        }),
      );
    }

    // console.log("credential", credential, formData);
    persistPrfsIdCredentialEncrypted(credential);
    persistEphemeralPrfsIdCredential(credential);
    handleSucceedSignIn(credential);
  }, [handleSucceedSignIn, formData, prfsSignInRequest, dispatch]);

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
          <DefaultModuleInputArea className={styles.inputArea}>
            <div className={styles.inputGroup}>
              <Input
                name={EMAIL}
                error={formErrors.email}
                label={i18n.email}
                value={formData.email}
                handleChangeValue={handleChangeValue}
                handleKeyDown={handleKeyDown}
              />
            </div>
            <div className={styles.inputGroup}>
              <Input
                name={PASSWORD_1}
                error={formErrors[PASSWORD_1]}
                label={i18n.password_1}
                value={formData[PASSWORD_1]}
                type="password"
                handleChangeValue={handleChangeValue}
              />
            </div>
            <div className={styles.inputGroup}>
              <Input
                type="password"
                name={PASSWORD_2}
                error={formErrors[PASSWORD_2]}
                label={i18n.password_2}
                value={formData[PASSWORD_2]}
                handleChangeValue={handleChangeValue}
                handleKeyDown={handleKeyDown}
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
