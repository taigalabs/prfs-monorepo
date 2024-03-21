import React from "react";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import { idApi } from "@taigalabs/prfs-api-js";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { useRouter } from "next/navigation";
import Fade from "@taigalabs/prfs-react-lib/src/fade/Fade";
import cn from "classnames";
import { IoMdEye } from "@react-icons/all-files/io/IoMdEye";
import { AiOutlineCopy } from "@react-icons/all-files/ai/AiOutlineCopy";
import copy from "copy-to-clipboard";
import Tooltip from "@taigalabs/prfs-react-lib/src/tooltip/Tooltip";
import { IdCreateForm } from "@/functions/validate_id";
import Link from "next/link";
import { useMutation } from "@taigalabs/prfs-react-lib/react_query";
import { setGlobalError } from "@taigalabs/prfs-react-lib/src/global_error_reducer";
import { SignUpPrfsIdentityRequest } from "@taigalabs/prfs-entities/bindings/SignUpPrfsIdentityRequest";
import {
  PASSWORD_1,
  PrfsIdCredential,
  makeColor,
  ID,
  PASSWORD_2,
} from "@taigalabs/prfs-id-sdk-web";

import styles from "./SignUp.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  DefaultInnerPadding,
  DefaultInputGuide,
  DefaultModuleBtnRow,
  DefaultModuleHeader,
  DefaultModuleSubtitle,
  DefaultModuleTitle,
} from "@/components/default_module/DefaultModule";
import { useAppDispatch } from "@/state/hooks";
import { persistPrfsIdCredentialEncrypted } from "@/storage/prfs_id_credential";
import AppLogoArea from "../app_logo_area/AppLogoArea";

export enum IdCreationStatus {
  Standby,
  InProgress,
  Error,
}

const SignUp: React.FC<SignUpProps> = ({
  formData,
  handleClickPrev,
  handleSucceedSignIn,
  credential,
}) => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();
  const [status, setStatus] = React.useState(IdCreationStatus.Standby);
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = React.useState(false);
  const { mutateAsync: signUpPrfsIdentity } = useMutation({
    mutationFn: (req: SignUpPrfsIdentityRequest) => {
      return idApi({ type: "sign_up_prfs_identity", ...req });
    },
  });

  const handleClickShowPassword = React.useCallback(() => {
    setShowPassword(val => !val);
  }, [setShowPassword]);

  const handleClickCopyPassword = React.useCallback(() => {
    const { id, password_1, password_2 } = formData;
    const pw = `${id}${password_1}${password_2}`;
    copy(pw);
  }, [formData]);

  const handleClickSignUp = React.useCallback(async () => {
    if (credential) {
      const { id } = credential;

      try {
        setStatus(IdCreationStatus.InProgress);
        const avatar_color = makeColor(id);
        const { error } = await signUpPrfsIdentity({
          identity_id: id,
          avatar_color,
          public_key: credential.public_key,
        });
        setStatus(IdCreationStatus.Standby);

        if (error) {
          dispatch(
            setGlobalError({
              message: error.toString(),
            }),
          );
          return;
        } else {
          persistPrfsIdCredentialEncrypted(credential);
          handleSucceedSignIn(credential);
        }
      } catch (err: any) {
        dispatch(
          setGlobalError({
            message: err.toString(),
          }),
        );
        return;
      }
    }
  }, [formData, router, signUpPrfsIdentity, credential, handleSucceedSignIn, dispatch]);

  const { id_val, password_1_val, password_2_val, secret_key_val } = React.useMemo(() => {
    if (showPassword) {
      return {
        id_val: formData[ID],
        password_1_val: formData[PASSWORD_1],
        password_2_val: formData[PASSWORD_2],
        secret_key_val: credential.secret_key,
      };
    } else {
      const id_val = formData[ID]
        ? `${formData[ID].substring(0, 2)}${"*".repeat(formData[ID].length - 2)}`
        : "";
      const password_1_val = formData[PASSWORD_1] ? "*".repeat(formData[PASSWORD_1].length) : "";
      const password_2_val = formData[PASSWORD_2] ? "*".repeat(formData[PASSWORD_2].length) : "";
      const secret_key_val = "*".repeat(credential.secret_key.length);

      return {
        id_val,
        password_1_val,
        password_2_val,
        secret_key_val,
      };
    }
  }, [formData, showPassword, credential.secret_key]);

  return (
    <DefaultInnerPadding>
      {status === IdCreationStatus.InProgress && (
        <div className={styles.loadingOverlay}>
          <Spinner color="#1b62c0" />
        </div>
      )}
      <AppLogoArea subLabel="ID" />
      <div className={styles.wrapper}>
        <Fade>
          <DefaultModuleHeader noSidePadding>
            <DefaultModuleTitle>{i18n.create_an_identity}</DefaultModuleTitle>
            <DefaultModuleSubtitle>{i18n.check_your_credential}</DefaultModuleSubtitle>
          </DefaultModuleHeader>
          <div className={styles.inputArea}>
            <div className={styles.labelArea}>
              <p>{i18n.password_secret_key}</p>
              <div className={styles.btnArea}>
                <div className={styles.showPasswordBtn} onClick={handleClickShowPassword}>
                  <Tooltip label={i18n.show} offset={6}>
                    <IoMdEye />
                  </Tooltip>
                </div>
                <div className={styles.showPasswordBtn} onClick={handleClickCopyPassword}>
                  <Tooltip label={i18n.copy} offset={6}>
                    <AiOutlineCopy />
                  </Tooltip>
                </div>
              </div>
            </div>
            <div className={styles.content}>
              <div className={styles.secretKey}>
                <div className={styles.value}>
                  <span>{id_val}</span>
                  <span>{password_1_val}</span>
                  <span>{password_2_val}</span>
                </div>
                <div className={cn(styles.value, styles.borderTop)}>{secret_key_val}</div>
              </div>
            </div>
          </div>
          <DefaultInputGuide>
            <Link
              href={`${process.env.NEXT_PUBLIC_DOCS_WEBSITE_ENDPOINT}/identity`}
              target="_blank"
            >
              {i18n.how_is_the_password_generated}
            </Link>
          </DefaultInputGuide>
          <div className={styles.inputArea}>
            <div className={styles.labelArea}>
              <p>{i18n.id}</p>
            </div>
            <div className={styles.content}>
              <div className={styles.value}>{credential.id}</div>
            </div>
          </div>
          <DefaultInputGuide>
            <Link
              href={`${process.env.NEXT_PUBLIC_DOCS_WEBSITE_ENDPOINT}/identity`}
              target="_blank"
            >
              {i18n.what_is_id}
            </Link>
          </DefaultInputGuide>
          <DefaultInputGuide>
            <Link
              href={`${process.env.NEXT_PUBLIC_DOCS_WEBSITE_ENDPOINT}/identity`}
              target="_blank"
            >
              {i18n.what_happens_when_signing_up}
            </Link>
          </DefaultInputGuide>
          <DefaultModuleBtnRow className={styles.btnRow} noSidePadding>
            <Button
              type="button"
              variant="transparent_blue_3"
              rounded
              noTransition
              handleClick={handleClickPrev}
              noShadow
            >
              {i18n.go_back}
            </Button>
            <Button
              type="button"
              variant="blue_3"
              className={styles.createBtn}
              rounded
              noTransition
              handleClick={handleClickSignUp}
              noShadow
            >
              {i18n.sign_up}
            </Button>
          </DefaultModuleBtnRow>
        </Fade>
      </div>
    </DefaultInnerPadding>
  );
};

export default SignUp;

export interface SignUpProps {
  formData: IdCreateForm;
  handleClickPrev: () => void;
  handleClickSignIn: () => void;
  credential: PrfsIdCredential;
  handleSucceedSignIn: (credential: PrfsIdCredential) => void;
}
