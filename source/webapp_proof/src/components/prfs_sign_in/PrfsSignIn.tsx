"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import styles from "./PrfsSignIn.module.scss";
import { i18nContext } from "@/contexts/i18n";
import PrfsIdSignInModule, {
  PrfsIdSignInForm,
  PrfsIdSignInModuleFooter,
} from "@/components/prfs_id_sign_in_module/PrfsIdSignInModule";
import { paths } from "@/paths";
import {
  IdCreateForm,
  makeEmptyIDCreateFormErrors,
  makeEmptyIdCreateForm,
  validateIdCreateForm,
} from "@/functions/validate_id";
// import Step1 from "./Step1";
// import Step2 from "./Step2";
import { envs } from "@/envs";

enum CreateIDStep {
  InputCredential,
  CreateIdSuccess,
}

const PrfsSignIn: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();
  const [formData, setFormData] = React.useState<IdCreateForm>(makeEmptyIdCreateForm());
  const [formErrors, setFormErrors] = React.useState<IdCreateForm>(makeEmptyIDCreateFormErrors());
  const [step, setStep] = React.useState(CreateIDStep.InputCredential);

  const handleClickSignIn = React.useCallback(() => {
    const { search } = window.location;
    const url = `${paths.id__signin}${search}`;
    router.push(url);
  }, [router]);

  const handleClickPrev = React.useCallback(() => {
    setStep(CreateIDStep.InputCredential);
  }, [setStep]);

  return <div>po123 signin</div>;
};

export default PrfsSignIn;
