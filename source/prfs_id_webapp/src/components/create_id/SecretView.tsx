import React from "react";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import { PrivateKey, sigPoseidon } from "@taigalabs/prfs-crypto-js";
import { idApi } from "@taigalabs/prfs-api-js";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { useRouter } from "next/navigation";
import Fade from "@taigalabs/prfs-react-lib/src/fade/Fade";
import cn from "classnames";
import { IoMdEye } from "@react-icons/all-files/io/IoMdEye";
import { AiOutlineCopy } from "@react-icons/all-files/ai/AiOutlineCopy";
import copy from "copy-to-clipboard";
import Tooltip from "@taigalabs/prfs-react-lib/src/tooltip/Tooltip";
import { IdCreateForm } from "@/identity";
import Link from "next/link";
import { useMutation } from "@taigalabs/prfs-react-lib/react_query";
import { SignUpPrfsIdentityRequest } from "@taigalabs/prfs-entities/bindings/SignUpPrfsIdentityRequest";
import {
  // PASSWORD_1,
  PrfsIdCredential,
  makeIdentityColor,
  ID,
  // PASSWORD
  // PASSWORD_2,
} from "@taigalabs/prfs-id-sdk-web";

import styles from "./SecretView.module.scss";
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
import { setGlobalMsg } from "@/state/globalMsgReducer";
import { envs } from "@/envs";

export enum IdCreationStatus {
  Standby,
  InProgress,
  Error,
}

const SecretView: React.FC<SignUpProps> = ({
  formData,
  handleClickSignIn,
  handleClickNext,
  // handleClickPrev,
  // handleSucceedSignIn,
  // credential,
}) => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();
  const [status, setStatus] = React.useState(IdCreationStatus.Standby);
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = React.useState(false);

  const secret = React.useMemo(() => {
    const sk = new PrivateKey();
    return sk.toHex();
  }, []);

  const secretElem = React.useMemo(() => {
    const chunks = [];
    const stride = 8;
    const charsLength = secret.length;

    for (let i = 0; i < charsLength; i += stride) {
      chunks.push(<span key={i}>{secret.substring(i, i + stride)}</span>);
    }

    return chunks;
  }, [secret]);

  const { mutateAsync: signUpPrfsIdentity } = useMutation({
    mutationFn: (req: SignUpPrfsIdentityRequest) => {
      return idApi({ type: "sign_up_prfs_identity", ...req });
    },
  });

  const handleClickShowPassword = React.useCallback(() => {
    setShowPassword(val => !val);
  }, [setShowPassword]);

  const handleClickCopyPassword = React.useCallback(() => {
    // const { id, password_1, password_2 } = formData;
    // const pw = `${id}${password_1}${password_2}`;
    // copy(pw);
  }, [formData]);

  const handleClickSignUp = React.useCallback(async () => {
    // if (credential) {
    //   const { id } = credential;
    //   try {
    //     setStatus(IdCreationStatus.InProgress);
    //     const avatar_color = makeIdentityColor(id);
    //     const { error } = await signUpPrfsIdentity({
    //       identity_id: id,
    //       avatar_color,
    //       public_key: credential.public_key,
    //     });
    //     setStatus(IdCreationStatus.Standby);
    //     if (error) {
    //       dispatch(
    //         setGlobalMsg({
    //           variant: "error",
    //           message: error.toString(),
    //         }),
    //       );
    //       return;
    //     } else {
    //       persistPrfsIdCredentialEncrypted(credential);
    //       handleSucceedSignIn(credential);
    //     }
    //   } catch (err: any) {
    //     dispatch(
    //       setGlobalMsg({
    //         variant: "error",
    //         message: err.toString(),
    //       }),
    //     );
    //     return;
    //   }
    // }
  }, [formData, router, signUpPrfsIdentity, dispatch]);

  // const { id_val, password_1_val, password_2_val, secret_key_val } = React.useMemo(() => {
  //   if (showPassword) {
  //     return {
  //       id_val: formData[ID],
  //       password_1_val: formData[PASSWORD_1],
  //       password_2_val: formData[PASSWORD_2],
  //       secret_key_val: credential.secret_key,
  //     };
  //   } else {
  //     const id_val = formData[ID]
  //       ? `${formData[ID].substring(0, 2)}${"*".repeat(formData[ID].length - 2)}`
  //       : "";
  //     const password_1_val = formData[PASSWORD_1] ? "*".repeat(formData[PASSWORD_1].length) : "";
  //     const password_2_val = formData[PASSWORD_2] ? "*".repeat(formData[PASSWORD_2].length) : "";
  //     const secret_key_val = "*".repeat(credential.secret_key.length);

  //     return {
  //       id_val,
  //       password_1_val,
  //       password_2_val,
  //       secret_key_val,
  //     };
  //   }
  // }, [formData, showPassword, credential.secret_key]);

  return (
    <DefaultInnerPadding>
      {status === IdCreationStatus.InProgress && (
        <div className={styles.loadingOverlay}>
          <Spinner color="#1b62c0" />
        </div>
      )}
      <div className={styles.wrapper}>
        <Fade>
          <DefaultModuleHeader noSidePadding>
            <DefaultModuleTitle>{i18n.remember_a_secret}</DefaultModuleTitle>
            <DefaultModuleSubtitle>{i18n.now_is_the_time_to_write_it_down}</DefaultModuleSubtitle>
          </DefaultModuleHeader>
          <div className={styles.inputArea}>
            <div className={styles.labelArea}>
              <p>{i18n.secret}</p>
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
                <div className={styles.value}>{secretElem}</div>
              </div>
            </div>
          </div>
          <DefaultInputGuide>
            <Link href={`${envs.NEXT_PUBLIC_PRFS_DOCS_WEBSITE_ENDPOINT}/identity`} target="_blank">
              {i18n.what_happens_when_registering_id}
            </Link>
          </DefaultInputGuide>
          <DefaultModuleBtnRow className={styles.btnRow} noSidePadding>
            {/* <Button */}
            {/*   type="button" */}
            {/*   variant="transparent_blue_3" */}
            {/*   rounded */}
            {/*   noTransition */}
            {/*   handleClick={handleClickPrev} */}
            {/*   noShadow */}
            {/* > */}
            {/*   {i18n.go_back} */}
            {/* </Button> */}
            <Button
              className={styles.btn}
              rounded
              type="button"
              variant="transparent_blue_3"
              noTransition
              handleClick={handleClickSignIn}
              noShadow
            >
              {i18n.already_have_id}
            </Button>
            <Button
              type="button"
              variant="blue_3"
              className={styles.createBtn}
              rounded
              noTransition
              handleClick={handleClickNext}
              noShadow
            >
              {i18n.next}
            </Button>
          </DefaultModuleBtnRow>
        </Fade>
      </div>
    </DefaultInnerPadding>
  );
};

export default SecretView;

export interface SignUpProps {
  formData: IdCreateForm;
  setFormData: React.Dispatch<React.SetStateAction<IdCreateForm>>;
  // handleClickPrev: () => void;
  // credential: PrfsIdCredential;
  // handleSucceedSignIn: (credential: PrfsIdCredential) => void;
  handleClickNext: () => void;
  handleClickSignIn: () => void;
  // setCredential: React.Dispatch<React.SetStateAction<PrfsIdCredential | null>>;
}
