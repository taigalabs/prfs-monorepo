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
import * as ethers from "ethers";
import * as secp from "@noble/secp256k1";
import { IdForm, validateIdForm } from "@/functions/validate_id";
import Tooltip from "@taigalabs/prfs-react-components/src/tooltip/Tooltip";

enum CreateIdModuleStatus {
  StandBy,
  ElementLoadInProgress,
  ElementIsLoaded,
  Error,
}

const prfsSDK = new PrfsSDK("prfs-proof");

const Step2: React.FC<Step2Props> = ({ formData }) => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSDKInitiated = React.useRef(false);
  const [createIdModuleStatus, setCreateIdModuleStatus] = React.useState(
    CreateIdModuleStatus.StandBy,
  );
  const [showPassword, setShowPassword] = React.useState(false);
  const [utilsElem, setUtilsElem] = React.useState<UtilsElement | null>(null);

  React.useEffect(() => {
    async function fn() {
      if (isSDKInitiated.current) {
        return;
      }
      isSDKInitiated.current = true;

      try {
        setCreateIdModuleStatus(CreateIdModuleStatus.ElementLoadInProgress);

        const utilsElem: UtilsElement = await prfsSDK.create("utils", {
          sdkEndpoint: process.env.NEXT_PUBLIC_PRFS_SDK_WEB_ENDPOINT,
        });

        setUtilsElem(utilsElem);

        const { email, password_1, password_2 } = formData;
        const pw = `${email}${password_1}${password_2}`;

        let pwBytes = ethers.utils.toUtf8Bytes(pw);
        const p = Array.from(pwBytes);
        utilsElem.hash(p as bigint[]);

        // let a = ethers.utils.keccak256(pwBytes);
        // let ccc = a.substring(2);

        // let a2 = ethers.utils.toUtf8Bytes(a);
        // console.log(111, b, a, ccc);

        // let c = secp.getPublicKey(ccc);
        // console.log(22, c);

        // let c2 = ethers.utils.toUtf8String(c);
        // let bb = secp.utils.randomPrivateKey();

        setCreateIdModuleStatus(CreateIdModuleStatus.ElementIsLoaded);

        // console.log(11, elem);

        // elem.subscribe(ev => {
        //   const { type, payload } = ev;

        //   if (type === "LOAD_DRIVER_EVENT") {
        //     if (payload.asset_label && payload.progress) {
        //       setLoadDriverProgress(oldVal => ({
        //         ...oldVal,
        //         [payload.asset_label!]: payload.progress,
        //       }));
        //     }
        //   }

        //   if (type === "LOAD_DRIVER_SUCCESS") {
        //     const now = dayjs();
        //     const diff = now.diff(since, "seconds", true);
        //     const { artifactCount } = payload;

        //     setDriverMsg(
        //       <>
        //         <span>Circuit driver </span>
        //         <a
        //           href={`${envs.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT}/circuit_drivers/${circuit_driver_id}`}
        //         >
        //           {proofType.circuit_driver_id} <BiLinkExternal />
        //         </a>
        //         <span>
        //           ({diff} seconds, {artifactCount} artifacts)
        //         </span>
        //       </>,
        //     );
        //     setLoadDriverStatus(LoadDriverStatus.StandBy);
        //   }

        //   if (type === "CREATE_PROOF_EVENT") {
        //     setSystemMsg(payload.payload);
        //   }
        // });

        // setProofGenElement(elem);
        return elem;
      } catch (err) {
        // setDriverMsg(`Driver init failed, id: ${circuit_driver_id}, err: ${err}`);
      }
    }

    fn().then();
  }, [router, searchParams, formData, setUtilsElem]);

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
