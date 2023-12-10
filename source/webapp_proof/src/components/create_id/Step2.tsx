"use client";

import React from "react";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import { makeAvatarColor, prfsApi2 } from "@taigalabs/prfs-api-js";
import Spinner from "@taigalabs/prfs-react-components/src/spinner/Spinner";
import { useRouter } from "next/navigation";
import Fade from "@taigalabs/prfs-react-components/src/fade/Fade";
import cn from "classnames";
import { IoMdEye } from "@react-icons/all-files/io/IoMdEye";
import { AiOutlineCopy } from "@react-icons/all-files/ai/AiOutlineCopy";
import copy from "copy-to-clipboard";
import { makeCredential } from "@taigalabs/prfs-crypto-js";
import Tooltip from "@taigalabs/prfs-react-components/src/tooltip/Tooltip";
import { IdCreateForm } from "@/functions/validate_id";
import Link from "next/link";
import { useMutation } from "wagmi";
import { PrfsSignUpRequest } from "@taigalabs/prfs-entities/bindings/PrfsSignUpRequest";

import styles from "./Step2.module.scss";
import { i18nContext } from "@/contexts/i18n";
import {
  SignInErrorMsg,
  SignInInputGuide,
  SignInModuleBtnRow,
  SignInModuleHeader,
  SignInModuleLogoArea,
  SignInModuleSubtitle,
  SignInModuleTitle,
} from "@/components/sign_in_module/SignInModule";
import { paths } from "@/paths";

export enum IdCreationStatus {
  StandBy,
  InProgress,
  Error,
}

const Step2: React.FC<Step2Props> = ({ formData, handleClickPrev }) => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();
  const [status, setStatus] = React.useState(IdCreationStatus.StandBy);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [credential, setCredential] = React.useState({
    secret_key: "",
    public_key: "",
    id: "",
  });
  const { mutateAsync: prfsSignUpRequest } = useMutation({
    mutationFn: (req: PrfsSignUpRequest) => {
      return prfsApi2("sign_up_prfs_account", req);
    },
  });

  React.useEffect(() => {
    async function fn() {
      try {
        setStatus(IdCreationStatus.InProgress);
        const credential = await makeCredential({
          email: formData.email,
          password_1: formData.password_1,
          password_2: formData.password_2,
        });

        console.log("credential", credential);
        setCredential(credential);
        setStatus(IdCreationStatus.StandBy);
      } catch (err) {
        setErrorMsg(`Driver init failed, err: ${err}`);
      }
    }

    fn().then();
  }, [router, formData, setCredential, setErrorMsg, setStatus]);

  const handleClickShowPassword = React.useCallback(() => {
    setShowPassword(val => !val);
  }, [setShowPassword]);

  const handleClickCopyPassword = React.useCallback(() => {
    const { email, password_1, password_2 } = formData;
    const pw = `${email}${password_1}${password_2}`;
    copy(pw);
  }, [formData]);

  const handleClickSignUp = React.useCallback(async () => {
    const { search } = window.location;
    const { id } = credential;

    if (id) {
      try {
        setStatus(IdCreationStatus.InProgress);
        const avatar_color = makeAvatarColor();
        const { payload, error } = await prfsSignUpRequest({
          account_id: id,
          avatar_color,
        });
        setStatus(IdCreationStatus.StandBy);

        if (error) {
          setErrorMsg(error.toString());
        } else {
          const url = `${paths.id__signin}${search}`;
          router.push(url);
        }
      } catch (err: any) {
        setErrorMsg(err.toString());
      }
    }

  }, [formData, router, prfsSignUpRequest, credential, setErrorMsg]);

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
    <div>
      {status === IdCreationStatus.InProgress && (
        <div className={styles.loadingOverlay}>
          <Spinner color="#1b62c0" />
        </div>
      )}
      <SignInModuleLogoArea />
      <div className={styles.wrapper}>
        <Fade>
          <SignInModuleHeader>
            <SignInModuleTitle>{i18n.create_an_identity}</SignInModuleTitle>
            <SignInModuleSubtitle>{i18n.check_your_credential}</SignInModuleSubtitle>
          </SignInModuleHeader>
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
          <SignInInputGuide>
            <Link href={`${process.env.NEXT_PUBLIC_DOCS_WEBSITE_ENDPOINT}/zauth`} target="_blank">
              {i18n.how_is_the_password_generated}
            </Link>
          </SignInInputGuide>
          <div className={styles.inputArea}>
            <div className={styles.labelArea}>
              <p>{i18n.id}</p>
            </div>
            <div className={styles.content}>
              <div className={styles.value}>{credential.id}</div>
            </div>
          </div>
          <SignInInputGuide>
            <Link href={`${process.env.NEXT_PUBLIC_DOCS_WEBSITE_ENDPOINT}/zauth`} target="_blank">
              {i18n.what_is_id}
            </Link>
          </SignInInputGuide>
          <SignInModuleBtnRow className={styles.btnRow}>
            <Button
              type="button"
              variant="transparent_blue_2"
              noTransition
              handleClick={handleClickPrev}
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
          </SignInModuleBtnRow>
          <SignInModuleBtnRow className={styles.secondBtnRow}>
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
          </SignInModuleBtnRow>
          <SignInErrorMsg>{errorMsg}</SignInErrorMsg>
          <SignInInputGuide className={styles.rightAlign}>
            <Link href={`${process.env.NEXT_PUBLIC_DOCS_WEBSITE_ENDPOINT}/zauth`} target="_blank">
              {i18n.what_happens_when_signing_up}
            </Link>
          </SignInInputGuide>
        </Fade>
      </div>
    </div>
  );
};

export default Step2;

export interface Step2Props {
  formData: IdCreateForm;
  handleClickPrev: () => void;
}
