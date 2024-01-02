import React from "react";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import { idApi } from "@taigalabs/prfs-api-js";
import Spinner from "@taigalabs/prfs-react-components/src/spinner/Spinner";
import { useRouter } from "next/navigation";
import Fade from "@taigalabs/prfs-react-components/src/fade/Fade";
import cn from "classnames";
import { IoMdEye } from "@react-icons/all-files/io/IoMdEye";
import { AiOutlineCopy } from "@react-icons/all-files/ai/AiOutlineCopy";
import copy from "copy-to-clipboard";
import Tooltip from "@taigalabs/prfs-react-components/src/tooltip/Tooltip";
import { IdCreateForm } from "@/functions/validate_id";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { PrfsIdentitySignUpRequest } from "@taigalabs/prfs-entities/bindings/PrfsIdentitySignUpRequest";
import { PrfsIdCredential, makeColor } from "@taigalabs/prfs-id-sdk-web";

import styles from "./SignUp.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  DefaultErrorMsg,
  DefaultInnerPadding,
  DefaultInputGuide,
  DefaultModuleBtnRow,
  DefaultModuleHeader,
  DefaultModuleLogoArea,
  DefaultModuleSubtitle,
  DefaultModuleTitle,
} from "@/components/default_module/DefaultModule";

export enum IdCreationStatus {
  Standby,
  InProgress,
  Error,
}

const SignUp: React.FC<SignUpProps> = ({
  formData,
  handleClickPrev,
  handleClickSignIn,
  handleSucceedCreateId,
  credential,
}) => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();
  const [status, setStatus] = React.useState(IdCreationStatus.Standby);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const { mutateAsync: prfsIdentitySignUpRequest } = useMutation({
    mutationFn: (req: PrfsIdentitySignUpRequest) => {
      return idApi("sign_up_prfs_identity", req);
    },
  });

  const handleClickShowPassword = React.useCallback(() => {
    setShowPassword(val => !val);
  }, [setShowPassword]);

  const handleClickCopyPassword = React.useCallback(() => {
    const { email, password_1, password_2 } = formData;
    const pw = `${email}${password_1}${password_2}`;
    copy(pw);
  }, [formData]);

  const handleClickSignUp = React.useCallback(async () => {
    if (credential) {
      const { id } = credential;

      try {
        setStatus(IdCreationStatus.InProgress);
        const avatar_color = makeColor(id);
        const { error } = await prfsIdentitySignUpRequest({
          identity_id: id,
          avatar_color,
        });
        setStatus(IdCreationStatus.Standby);

        if (error) {
          setErrorMsg(error.toString());
        } else {
          handleSucceedCreateId(credential);
        }
      } catch (err: any) {
        setErrorMsg(err.toString());
      }
    }
  }, [formData, router, prfsIdentitySignUpRequest, credential, setErrorMsg, handleSucceedCreateId]);

  const { email_val, password_1_val, password_2_val, secret_key_val } = React.useMemo(() => {
    if (showPassword) {
      return {
        email_val: formData.email,
        password_1_val: formData.password_1,
        password_2_val: formData.password_2,
        secret_key_val: credential.secret_key,
      };
    } else {
      const email_val = `${formData.email.substring(0, 2)}${"*".repeat(formData.email.length - 2)}`;
      const password_1_val = "*".repeat(formData.password_1.length);
      const password_2_val = "*".repeat(formData.password_2.length);
      const secret_key_val = "*".repeat(credential.secret_key.length);

      return {
        email_val,
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
      <DefaultModuleLogoArea />
      <div className={styles.wrapper}>
        <Fade>
          <DefaultModuleHeader>
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
                  <span>{email_val}</span>
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
          <DefaultModuleBtnRow className={styles.btnRow}>
            <Button
              type="button"
              variant="transparent_blue_2"
              noTransition
              handleClick={handleClickSignIn}
              noShadow
            >
              {i18n.already_have_id}
            </Button>
            <Button
              type="button"
              variant="blue_2"
              className={styles.createBtn}
              noTransition
              handleClick={handleClickSignUp}
              noShadow
            >
              {i18n.sign_up}
            </Button>
          </DefaultModuleBtnRow>
          <DefaultModuleBtnRow className={styles.secondBtnRow}>
            <Button
              type="button"
              variant="transparent_blue_2"
              noTransition
              handleClick={handleClickPrev}
              noShadow
            >
              {i18n.go_back}
            </Button>
            <div />
          </DefaultModuleBtnRow>
          <DefaultErrorMsg>{errorMsg}</DefaultErrorMsg>
          <DefaultInputGuide className={styles.rightAlign}>
            <Link
              href={`${process.env.NEXT_PUBLIC_DOCS_WEBSITE_ENDPOINT}/identity`}
              target="_blank"
            >
              {i18n.what_happens_when_signing_up}
            </Link>
          </DefaultInputGuide>
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
  handleSucceedCreateId: (credential: PrfsIdCredential) => void;
}
