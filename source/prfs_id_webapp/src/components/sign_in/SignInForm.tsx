import React from "react";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import Input from "@taigalabs/prfs-react-lib/src/input/Input";
import {
  ID,
  PASSWORD_1,
  PASSWORD_2,
  PrfsIdCredential,
  makePrfsIdCredential,
} from "@taigalabs/prfs-id-sdk-web";
import { useMutation } from "@taigalabs/prfs-react-lib/react_query";
import { idApi, prfsApi3 } from "@taigalabs/prfs-api-js";
import { SignInPrfsIdentityRequest } from "@taigalabs/prfs-entities/bindings/SignInPrfsIdentityRequest";
import prfs_api_error_codes from "@taigalabs/prfs-api-error-codes";
import { setGlobalError } from "@taigalabs/prfs-react-lib/src/global_error_reducer";

import styles from "./SignInForm.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  DefaultInnerPadding,
  DefaultModuleBtnRow,
  DefaultModuleHeader,
  DefaultModuleInputArea,
  DefaultModuleSubtitle,
  DefaultModuleTitle,
} from "@/components/default_module/DefaultModule";
import { IdCreateForm } from "@/functions/validate_id";
import { persistPrfsIdCredentialEncrypted } from "@/storage/prfs_id_credential";
import { persistEphemeralPrfsIdCredential } from "@/storage/ephe_credential";
import { useAppDispatch } from "@/state/hooks";
import AppLogoArea from "@/components/app_logo_area/AppLogoArea";

enum InputCredentialStatus {
  Loading,
  Standby,
}

const SignInForm: React.FC<InputCredentialProps> = ({
  appId,
  formData,
  setFormData,
  formErrors,
  setFormErrors,
  handleClickCreateID,
  handleSucceedSignIn,
  handleClickStoredCredential,
}) => {
  const i18n = React.useContext(i18nContext);
  const [status, setStatus] = React.useState(InputCredentialStatus.Standby);
  const dispatch = useAppDispatch();
  const { mutateAsync: signInPrfsIdentity } = useMutation({
    mutationFn: (req: SignInPrfsIdentityRequest) => {
      return idApi({ type: "sign_in_prfs_identity", ...req });
    },
  });

  const title = React.useMemo(() => {
    return `${i18n.sign_in} to ${appId}`;
  }, [appId]);

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

        if ((formErrors as any)[name]) {
          setFormErrors(oldVals => ({
            ...oldVals,
            [name]: null,
          }));
        }
      }
    },
    [formData, setFormData, setFormErrors, formErrors],
  );

  const enhancedHandleClickNext = React.useCallback(async () => {
    if (!formData[ID]) {
      setFormErrors(oldVals => ({
        ...oldVals,
        [ID]: "Id should be given",
      }));
      return;
    }

    if (!formData[PASSWORD_1]) {
      setFormErrors(oldVals => ({
        ...oldVals,
        [PASSWORD_1]: "1st password should be given",
      }));
      return;
    }

    if (!formData[PASSWORD_2]) {
      setFormErrors(oldVals => ({
        ...oldVals,
        [PASSWORD_2]: "2nd password should be given",
      }));
      return;
    }

    const credential = await makePrfsIdCredential({
      id: formData[ID],
      password_1: formData[PASSWORD_1],
      password_2: formData[PASSWORD_2],
    });

    // console.log(33, credential);
    const { code } = await signInPrfsIdentity({ identity_id: credential.id });
    if (code === prfs_api_error_codes.CANNOT_FIND_USER.code) {
      dispatch(
        setGlobalError({
          message: `Cannot find the id. Have you signed up before? id: ${credential.id}`,
        }),
      );
      return;
    }

    // console.log("credential", credential, formData);
    persistPrfsIdCredentialEncrypted(credential);
    persistEphemeralPrfsIdCredential(credential);
    handleSucceedSignIn(credential);
  }, [handleSucceedSignIn, formData, signInPrfsIdentity, dispatch, setFormErrors]);

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
          <AppLogoArea subLabel="ID" />
          <DefaultModuleHeader noSidePadding>
            <DefaultModuleTitle>{title}</DefaultModuleTitle>
            <DefaultModuleSubtitle>{i18n.using_your_prfs_identity}</DefaultModuleSubtitle>
          </DefaultModuleHeader>
          <DefaultModuleInputArea className={styles.inputArea}>
            <div className={styles.inputGroup}>
              <Input
                name={ID}
                error={formErrors[ID]}
                label={i18n.email_or_id_or_wallet_addr}
                value={formData[ID]}
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
  appId: string;
  errorMsg: string | null;
  formData: IdCreateForm;
  setFormData: React.Dispatch<React.SetStateAction<IdCreateForm>>;
  formErrors: IdCreateForm;
  setFormErrors: React.Dispatch<React.SetStateAction<IdCreateForm>>;
  handleSucceedSignIn: (credential: PrfsIdCredential) => void;
  handleClickCreateID: () => void;
  handleClickStoredCredential: () => void;
}
