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
import { GetPrfsProofTypeByProofTypeIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsProofTypeByProofTypeIdRequest";
import { prfsApi2 } from "@taigalabs/prfs-api-js";

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
import { useMutation } from "@tanstack/react-query";

//
import { IdForm, validateIdForm } from "@/functions/validate_id";
import { hexlify } from "ethers/lib/utils";
import Link from "next/link";

enum CreateIdModuleStatus {
  StandBy,
  ValueInProgress,
  ValueReady,
  Error,
}

const Step2: React.FC<Step2Props> = ({ formData, handleClickPrev }) => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();
  const searchParams = useSearchParams();
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

  const { mutateAsync: getPrfsProofTypeByProofTypeIdRequest } = useMutation({
    mutationFn: (req: GetPrfsProofTypeByProofTypeIdRequest) => {
      return prfsApi2("get_prfs_proof_type_by_proof_type_id", req);
    },
  });

  React.useEffect(() => {
    async function fn() {
      try {
        setCreateIdModuleStatus(CreateIdModuleStatus.ValueInProgress);
        const wasm = await initWasm();
        const { email, password_1, password_2 } = formData;
        const pw = `${email}${password_1}${password_2}`;
        const pwBytes = ethers.utils.toUtf8Bytes(pw);
        const pwHash = wasm.poseidon(pwBytes);
        const pwInt = bytesToBigInt(pwHash);

        const pk = secp.getPublicKey(pwInt, false);
        const s1 = pk.subarray(1);
        const s2 = wasm.poseidon(s1);
        const id = s2.subarray(0, 20);

        console.log("credential", pwInt, pk, s1, s2, id);

        setCredential({
          secret_key: hexlify(pwInt),
          public_key: hexlify(pk),
          id: hexlify(id),
        });

        setCreateIdModuleStatus(CreateIdModuleStatus.ValueReady);
      } catch (err) {
        setAlertMsg(`Driver init failed, err: ${err}`);
      }
    }

    fn().then();
  }, [router, searchParams, formData, setCredential, setAlertMsg]);

  const handleClickShowPassword = React.useCallback(() => {
    setShowPassword(val => !val);
  }, [setShowPassword]);

  const handleClickCopyPassword = React.useCallback(() => {
    const { email, password_1, password_2 } = formData;
    const pw = `${email}${password_1}${password_2}`;
    copy(pw);
  }, [formData]);

  const handleClickCreate = React.useCallback(() => {}, [formData, router, searchParams]);

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
              handleClick={handleClickCreate}
              noShadow
            >
              {i18n.finish_by_signing_in}
            </Button>
          </SignInModuleBtnRow>
          {/* <SignInInputGuide> */}
          {/*   <Link href={`${process.env.NEXT_PUBLIC_DOCS_WEBSITE_ENDPOINT}/zauth`} target="_blank"> */}
          {/*     {i18n.how_is_the_password_generated} */}
          {/*   </Link> */}
          {/* </SignInInputGuide> */}
        </Fade>
      </div>
    </div>
  );
};

export default Step2;

export interface Step2Props {
  formData: IdForm;
  handleClickPrev: () => void;
}
