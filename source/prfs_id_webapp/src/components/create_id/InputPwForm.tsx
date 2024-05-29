import React from "react";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import Link from "next/link";
import Fade from "@taigalabs/prfs-react-lib/src/fade/Fade";
import {
  ID,
  PASSWORD,
  // PASSWORD_CONFIRM,
  // PASSWORD_2,
  PrfsIdCredential,
  SECRET,
  makePrfsIdCredential,
} from "@taigalabs/prfs-id-sdk-web";
import Input from "@taigalabs/prfs-react-lib/src/input/Input";

import styles from "./InputPwForm.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  DefaultInnerPadding,
  DefaultInputGuide,
  DefaultModuleBtnRow,
  DefaultModuleHeader,
  DefaultModuleInputArea,
  DefaultModuleSubtitle,
  DefaultModuleTitle,
} from "@/components/default_module/DefaultModule";
import { IdCreateForm, validateId, validateIdCreateForm } from "@/identity";
import { useAppDispatch } from "@/state/hooks";
import { envs } from "@/envs";

const ID_CONFIRM = "id_confirm";
const PASSWORD_CONFIRM = "password_confirm";
// const PASSWORD_2_CONFIRM = "password_2_confirm";

const InputPwForm: React.FC<InputCreateIdCredentialProps> = ({
  formData,
  setFormData,
  formErrors,
  setFormErrors,
  // handleClickSignIn,
  handleClickSignUp,
  // handleClickNext,
  setCredential,
}) => {
  const i18n = React.useContext(i18nContext);
  const dispatch = useAppDispatch();

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
    // const isValid = validateIdCreateForm(formData, setFormErrors);
    const isValid = validateId(formData, setFormErrors);

    if (isValid) {
      // const credential = await makePrfsIdCredential({
      //   id: formData[ID]!,
      //   password_1: formData[PASSWORD_1]!,
      //   password_2: formData[PASSWORD_2]!,
      // });
      // console.log("credential", credential);
      // setCredential(credential);
      // handleClickNext();
      handleClickSignUp();
    }
  }, [setCredential, dispatch, setFormErrors, handleClickSignUp]);

  // const handleClickSignUp = React.useCallback(async () => {
  //   // if (credential) {
  //   //   const { id } = credential;
  //   //   try {
  //   //     setStatus(IdCreationStatus.InProgress);
  //   //     const avatar_color = makeIdentityColor(id);
  //   //     const { error } = await signUpPrfsIdentity({
  //   //       identity_id: id,
  //   //       avatar_color,
  //   //       public_key: credential.public_key,
  //   //     });
  //   //     setStatus(IdCreationStatus.Standby);
  //   //     if (error) {
  //   //       dispatch(
  //   //         setGlobalMsg({
  //   //           variant: "error",
  //   //           message: error.toString(),
  //   //         }),
  //   //       );
  //   //       return;
  //   //     } else {
  //   //       persistPrfsIdCredentialEncrypted(credential);
  //   //       handleSucceedSignIn(credential);
  //   //     }
  //   //   } catch (err: any) {
  //   //     dispatch(
  //   //       setGlobalMsg({
  //   //         variant: "error",
  //   //         message: err.toString(),
  //   //       }),
  //   //     );
  //   //     return;
  //   //   }
  //   // }
  // }, [formData, router, signUpPrfsIdentity, dispatch]);

  return (
    <DefaultInnerPadding>
      <div className={styles.main}>
        <Fade>
          <DefaultModuleHeader noSidePadding>
            <DefaultModuleTitle>{i18n.enter_password}</DefaultModuleTitle>
            <DefaultModuleSubtitle>{i18n.create_a_strong_password}</DefaultModuleSubtitle>
          </DefaultModuleHeader>
          <DefaultModuleInputArea>
            {/* <div className={styles.inputGroup}> */}
            {/*   <Input */}
            {/*     className={styles.input} */}
            {/*     name={ID} */}
            {/*     error={formErrors[ID]} */}
            {/*     label={i18n.email_or_id_or_wallet_addr} */}
            {/*     value={formData[ID]} */}
            {/*     type="text" */}
            {/*     handleChangeValue={handleChangeValue} */}
            {/*   /> */}
            {/*   <Input */}
            {/*     name={ID_CONFIRM} */}
            {/*     error={formErrors[ID_CONFIRM]} */}
            {/*     label={i18n.confirm} */}
            {/*     value={formData[ID_CONFIRM]} */}
            {/*     type="text" */}
            {/*     handleChangeValue={handleChangeValue} */}
            {/*   /> */}
            {/* </div> */}
            {/* <DefaultInputGuide> */}
            {/*   <Link */}
            {/*     href={`${envs.NEXT_PUBLIC_PRFS_DOCS_WEBSITE_ENDPOINT}/identity`} */}
            {/*     target="_blank" */}
            {/*   > */}
            {/*     {i18n.how_to_choose_right_id} */}
            {/*   </Link> */}
            {/* </DefaultInputGuide> */}
            <div className={styles.inputGroup}>
              <Input
                name={SECRET}
                error={formErrors[SECRET]}
                label={i18n.secret}
                value={formData[SECRET]}
                type="text"
                handleChangeValue={handleChangeValue}
              />
            </div>
            <div className={styles.inputGroup}>
              <Input
                name={PASSWORD}
                error={formErrors[PASSWORD]}
                label={i18n.password}
                value={formData[PASSWORD]}
                type="password"
                handleChangeValue={handleChangeValue}
              />
              <Input
                name={PASSWORD_CONFIRM}
                error={formErrors[PASSWORD_CONFIRM]}
                label={i18n.confirm}
                value={formData[PASSWORD_CONFIRM]}
                type="password"
                handleChangeValue={handleChangeValue}
              />
            </div>
            {/* <div className={styles.inputGroup}> */}
            {/*   <Input */}
            {/*     name={PASSWORD_2} */}
            {/*     error={formErrors[PASSWORD_2]} */}
            {/*     label={i18n.password_2} */}
            {/*     value={formData[PASSWORD_2]} */}
            {/*     type="password" */}
            {/*     handleChangeValue={handleChangeValue} */}
            {/*   /> */}
            {/*   <Input */}
            {/*     name={PASSWORD_2_CONFIRM} */}
            {/*     error={formErrors[PASSWORD_2_CONFIRM]} */}
            {/*     label={i18n.confirm} */}
            {/*     value={formData[PASSWORD_2_CONFIRM]} */}
            {/*     type="password" */}
            {/*     handleChangeValue={handleChangeValue} */}
            {/*   /> */}
            {/* </div> */}
            <DefaultInputGuide>
              <Link
                href={`${envs.NEXT_PUBLIC_PRFS_DOCS_WEBSITE_ENDPOINT}/identity`}
                target="_blank"
              >
                {i18n.why_we_ask_for_two_passwords}
              </Link>
            </DefaultInputGuide>
          </DefaultModuleInputArea>
          <DefaultModuleBtnRow noSidePadding>
            {/* <Button */}
            {/*   className={styles.btn} */}
            {/*   rounded */}
            {/*   type="button" */}
            {/*   variant="transparent_blue_3" */}
            {/*   noTransition */}
            {/*   handleClick={handleClickSignIn} */}
            {/*   noShadow */}
            {/* > */}
            {/*   {i18n.already_have_id} */}
            {/* </Button> */}
            <div />
            <Button
              type="button"
              variant="blue_3"
              className={styles.btn}
              noTransition
              handleClick={enhancedHandleClickNext}
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

export default InputPwForm;

export interface InputCreateIdCredentialProps {
  formData: IdCreateForm;
  setFormData: React.Dispatch<React.SetStateAction<IdCreateForm>>;
  formErrors: IdCreateForm;
  setFormErrors: React.Dispatch<React.SetStateAction<IdCreateForm>>;
  // handleClickNext: () => void;
  handleClickSignUp: () => void;
  setCredential: React.Dispatch<React.SetStateAction<PrfsIdCredential | null>>;
}
