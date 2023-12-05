"use client";

import React from "react";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import Spinner from "@taigalabs/prfs-react-components/src/spinner/Spinner";
import { useRouter, useSearchParams } from "next/navigation";
import Fade from "@taigalabs/prfs-react-components/src/fade/Fade";
import { PrfsSDK } from "@taigalabs/prfs-sdk-web";
import cn from "classnames";
import UtilsElement from "@taigalabs/prfs-sdk-web/src/elems/utils_element/utils_element";
import { IoMdEye } from "@react-icons/all-files/io/IoMdEye";
import { AiOutlineCopy } from "@react-icons/all-files/ai/AiOutlineCopy";
import copy from "copy-to-clipboard";
import { initWasm } from "@taigalabs/prfs-crypto-js";
import * as ethers from "ethers";
import * as secp from "@noble/secp256k1";
import { bytesToBigInt } from "@taigalabs/prfs-crypto-js";
import Tooltip from "@taigalabs/prfs-react-components/src/tooltip/Tooltip";

import styles from "./Step2.module.scss";
import { i18nContext } from "@/contexts/i18n";
import SignInModule, {
  SignInInputGuide,
  SignInInputItem,
  SignInModuleBtnRow,
  SignInModuleHeader,
  SignInModuleInputArea,
  SignInModuleLogoArea,
  SignInModuleSubtitle,
  SignInModuleTitle,
} from "@/components/sign_in_module/SignInModule";

//
import { IdForm, validateIdForm } from "@/functions/validate_id";
import { hexlify } from "ethers/lib/utils";

enum CreateIdModuleStatus {
  StandBy,
  ElementLoadInProgress,
  ElementIsLoaded,
  Error,
}

const Step2: React.FC<Step2Props> = ({ formData }) => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [createIdModuleStatus, setCreateIdModuleStatus] = React.useState(
    CreateIdModuleStatus.StandBy,
  );
  const [showPassword, setShowPassword] = React.useState(false);

  React.useEffect(() => {
    async function fn() {
      try {
        const wasm = await initWasm();
        const { email, password_1, password_2 } = formData;
        const pw = `${email}${password_1}${password_2}`;
        const pwBytes = ethers.utils.toUtf8Bytes(pw);
        const pwHash = wasm.poseidon(pwBytes);
        const pwInt = bytesToBigInt(pwHash);

        const pk = secp.getPublicKey(pwInt, false);
        const s1 = pk.subarray(1);
        const s2 = wasm.poseidon(s1);
        const s3 = s2.subarray(0, 20);

        console.log(2233, pwInt, pk, s1, s2, s3);
      } catch (err) {
        // setDriverMsg(`Driver init failed, id: ${circuit_driver_id}, err: ${err}`);
      }
    }

    fn().then();
  }, [router, searchParams, formData]);

  const handleClickShowPassword = React.useCallback(() => {
    setShowPassword(val => !val);
  }, [setShowPassword]);

  const handleClickCopyPassword = React.useCallback(() => {
    const { email, password_1, password_2 } = formData;
    const pw = `${email}${password_1}${password_2}`;
    copy(pw);
  }, [formData]);

  const handleClickNext = React.useCallback(() => {}, [formData, router, searchParams]);

  const { password_1_val, password_2_val } = React.useMemo(() => {
    if (showPassword) {
      return {
        password_1_val: formData.password_1,
        password_2_val: formData.password_2,
      };
    } else {
      const password_1_val = "*".repeat(formData.password_1.length);
      const password_2_val = "*".repeat(formData.password_2.length);

      return {
        password_1_val,
        password_2_val,
      };
    }
  }, [formData, showPassword]);

  return (
    <div>
      {createIdModuleStatus === CreateIdModuleStatus.ElementLoadInProgress && (
        <div className={styles.loadingOverlay}>
          <Spinner color="#1b62c0" />
        </div>
      )}
      <SignInModuleLogoArea />
      <div className={styles.wrapper}>
        <Fade>
          <SignInModuleHeader>
            <SignInModuleTitle>{i18n.create_an_identity}</SignInModuleTitle>
            <SignInModuleSubtitle>{i18n.created_an_identity}</SignInModuleSubtitle>
          </SignInModuleHeader>
          <SignInModuleInputArea>
            <div className={styles.inputArea}>
              <div className={styles.input}>
                <span>{formData.email}</span>
                <span>{password_1_val}</span>
                <span>{password_2_val}</span>
              </div>
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
            <div></div>
          </SignInModuleInputArea>
          <SignInModuleBtnRow>
            <div />
            <Button
              variant="blue_2"
              className={styles.nextBtn}
              noTransition
              handleClick={handleClickNext}
              noShadow
            >
              {i18n.next}
            </Button>
          </SignInModuleBtnRow>
        </Fade>
      </div>
    </div>
  );
};

export default Step2;

export interface Step2Props {
  formData: IdForm;
}
