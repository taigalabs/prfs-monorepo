"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import styles from "./PrfsIdCreateID.module.scss";
import { i18nContext } from "@/i18n/context";
import PrfsIdSignInModule, {
  PrfsIdSignInForm,
  PrfsIdSignInModuleFooter,
} from "@/components/prfs_id/prfs_id_sign_in_module/PrfsIdSignInModule";
import { paths } from "@/paths";
import {
  IdCreateForm,
  makeEmptyIDCreateFormErrors,
  makeEmptyIdCreateForm,
  validateIdCreateForm,
} from "@/functions/validate_id";
import Step2 from "./Step2";
import { envs } from "@/envs";
import { PrfsIdCredential } from "@taigalabs/prfs-crypto-js";
import Step3 from "./Step3";
import InputCreateIdCredential from "./InputCreateIdCredential";

enum CreateIDStep {
  InputCreateIdCredential,
  CreateIdSuccess,
  PostSignUpSuccess,
}

const PrfsIdCreateID: React.FC<PrfsIdCreateIDProps> = ({
  handleClickSignIn,
  handleSucceedCreateId,
}) => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();
  const [formData, setFormData] = React.useState<IdCreateForm>(makeEmptyIdCreateForm());
  const [formErrors, setFormErrors] = React.useState<IdCreateForm>(makeEmptyIDCreateFormErrors());
  const [step, setStep] = React.useState(CreateIDStep.InputCreateIdCredential);
  const [credential, setCredential] = React.useState<PrfsIdCredential | null>(null);

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
      }
    },
    [formData, setFormData],
  );

  const handleGotoCreateIdSuccess = React.useCallback(() => {
    const res = validateIdCreateForm(formData, setFormErrors);

    if (res) {
      setStep(CreateIDStep.CreateIdSuccess);
    }
  }, [formData, setFormErrors, setStep]);

  const handleGotoPostSignUpSuccess = React.useCallback(() => {
    setStep(CreateIDStep.PostSignUpSuccess);
  }, [setStep]);

  // const handleClickSignIn = React.useCallback(() => {
  //   const { search } = window.location;
  //   const url = `${paths.id__app_signin}${search}`;
  //   router.push(url);
  // }, [router]);

  const handleGotoInputCredential = React.useCallback(() => {
    setStep(CreateIDStep.InputCreateIdCredential);
  }, [setStep]);

  const content = React.useMemo(() => {
    switch (step) {
      case CreateIDStep.InputCreateIdCredential: {
        return (
          <InputCreateIdCredential
            formData={formData}
            setFormData={setFormData}
            formErrors={formErrors}
            handleClickSignIn={handleClickSignIn}
            handleClickNext={handleGotoCreateIdSuccess}
            setCredential={setCredential}
          />
        );
      }
      case CreateIDStep.CreateIdSuccess: {
        return (
          credential && (
            <Step2
              credential={credential}
              formData={formData}
              handleClickPrev={handleGotoInputCredential}
              handleClickSignIn={handleClickSignIn}
              handleGotoPostSignUpSuccess={handleGotoPostSignUpSuccess}
            />
          )
        );
      }
      case CreateIDStep.PostSignUpSuccess: {
        return (
          credential && (
            <Step3
              credential={credential}
              handleSucceedCreateId={handleSucceedCreateId}
              handleClickSignIn={() => {}}
            />
          )
        );
      }
      default:
        <div>Invalid step</div>;
    }
  }, [step, handleGotoInputCredential, handleGotoCreateIdSuccess, handleChangeValue, formErrors]);

  return (
    <>{content}</>
    /* <PrfsIdSignInModule> */
    //   <PrfsIdSignInForm>{content}</PrfsIdSignInForm>
    //   <PrfsIdSignInModuleFooter>
    //     <Link className={styles.prfsLink} href={envs.NEXT_PUBLIC_CODE_REPOSITORY_URL}>
    //       <span>{i18n.code}</span>
    //     </Link>
    //     <Link className={styles.prfsLink} href={envs.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}>
    //       <span>{i18n.prfs}</span>
    //     </Link>
    //   </PrfsIdSignInModuleFooter>
    // </PrfsIdSignInModule>
  );
};

export default PrfsIdCreateID;

export interface PrfsIdCreateIDProps {
  handleClickSignIn: () => void;
  handleSucceedCreateId: (credential: PrfsIdCredential) => void;
}
