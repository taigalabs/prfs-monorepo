"use client";

import React from "react";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
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

import styles from "./Step2.module.scss";
import { i18nContext } from "@/contexts/i18n";
import {
  SignInInputGuide,
  SignInModuleBtnRow,
  SignInModuleHeader,
  SignInModuleLogoArea,
  SignInModuleSubtitle,
  SignInModuleTitle,
} from "@/components/sign_in_module/SignInModule";
import { paths } from "@/paths";

enum CreateIdModuleStatus {
  StandBy,
  ValueInProgress,
  ValueReady,
  Error,
}

const Step2: React.FC<Step2Props> = ({ formData, handleClickPrev }) => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();
  const [createIdModuleStatus, setCreateIdModuleStatus] = React.useState(
    CreateIdModuleStatus.StandBy,
  );
  const [alertMsg, setAlertMsg] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [credential, setCredential] = React.useState({
    secret_key: "",
    public_key: "",
    id: "",
  });

  React.useEffect(() => {
    async function fn() {
      try {
        setCreateIdModuleStatus(CreateIdModuleStatus.ValueInProgress);
        const credential = await makeCredential({
          email: formData.email,
          password_1: formData.password_1,
          password_2: formData.password_2,
        });

        console.log("credential", credential);
        setCredential(credential);
        setCreateIdModuleStatus(CreateIdModuleStatus.ValueReady);
      } catch (err) {
        setAlertMsg(`Driver init failed, err: ${err}`);
      }
    }

    fn().then();
  }, [router, formData, setCredential, setAlertMsg]);

  const handleClickShowPassword = React.useCallback(() => {
    setShowPassword(val => !val);
  }, [setShowPassword]);

  const handleClickCopyPassword = React.useCallback(() => {
    const { email, password_1, password_2 } = formData;
    const pw = `${email}${password_1}${password_2}`;
    copy(pw);
  }, [formData]);

  const handleClickSignIn = React.useCallback(() => {
    const { search } = window.location;
    const url = `${paths.accounts__signin}${search}`;
    router.push(url);
  }, [formData, router]);

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
      {createIdModuleStatus === CreateIdModuleStatus.ValueInProgress && (
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
              className={styles.createBtn}
              noTransition
              handleClick={handleClickPrev}
              noShadow
            >
              {i18n.go_back}
            </Button>
            <Button
              type="button"
              variant="blue_2"
              className={styles.createBtn}
              noTransition
              handleClick={handleClickSignIn}
              noShadow
            >
              {i18n.sign_up}
            </Button>
          </SignInModuleBtnRow>
          <SignInInputGuide className={styles.rightAlign}>
            <Link href={`${process.env.NEXT_PUBLIC_DOCS_WEBSITE_ENDPOINT}/zauth`} target="_blank">
              {i18n.what_is_signing_up}
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
