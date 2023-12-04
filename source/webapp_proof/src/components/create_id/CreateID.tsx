"use client";

import React from "react";

import styles from "./CreateID.module.scss";
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
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Fade from "@taigalabs/prfs-react-components/src/fade/Fade";
import { paths } from "@/paths";
import { IdForm, idFormEmpty, validateIdForm } from "@/functions/validate_id";
import Step2 from "./Step2";

enum CreateIDStep {
  InputCredential,
  CreateIdSuccess,
}

const CreateID: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = React.useState<IdForm>(idFormEmpty);
  const [formErrors, setFormErrors] = React.useState<IdForm>(idFormEmpty);
  const [step, setStep] = React.useState(CreateIDStep.InputCredential);

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

  const handleClickNext = React.useCallback(() => {
    const res = validateIdForm(formData, setFormErrors);

    if (res) {
      setStep(CreateIDStep.CreateIdSuccess);
    }
  }, [formData, setFormErrors, router, searchParams]);

  const emailGuideURL = React.useMemo(() => {
    const url = `${process.env.NEXT_PUBLIC_DOCS_WEBSITE_ENDPOINT}/zauth`;

    return url;
  }, []);

  const content = React.useMemo(() => {
    switch (step) {
      case CreateIDStep.InputCredential: {
        return (
          <Fade>
            <SignInModuleHeader>
              <SignInModuleTitle>{i18n.create_zauth_identity}</SignInModuleTitle>
              <SignInModuleSubtitle>{i18n.type_information}</SignInModuleSubtitle>
            </SignInModuleHeader>
            <SignInModuleInputArea>
              <div className={styles.inputGroup}>
                <SignInInputItem
                  name="email"
                  value={formData.email}
                  placeholder={i18n.email}
                  error={formErrors.email}
                  handleChangeValue={handleChangeValue}
                />
                <SignInInputItem
                  name="email_confirm"
                  value={formData.email_confirm}
                  placeholder={i18n.confirm}
                  error={formErrors.email_confirm}
                  handleChangeValue={handleChangeValue}
                />
              </div>
              <SignInInputGuide>
                <Link href={emailGuideURL} target="_blank">
                  {i18n.why_we_ask_for_email}
                </Link>
              </SignInInputGuide>
              <div className={styles.inputGroup}>
                <SignInInputItem
                  name="password_1"
                  value={formData.password_1}
                  placeholder={i18n.password_1}
                  error={formErrors.password_1}
                  handleChangeValue={handleChangeValue}
                  type="password"
                />
                <SignInInputItem
                  name="password_1_confirm"
                  value={formData.password_1_confirm}
                  placeholder={i18n.confirm}
                  error={formErrors.password_1_confirm}
                  handleChangeValue={handleChangeValue}
                  type="password"
                />
              </div>
              <div className={styles.inputGroup}>
                <SignInInputItem
                  name="password_2"
                  value={formData.password_2}
                  placeholder={i18n.password_2}
                  error={formErrors.password_2}
                  handleChangeValue={handleChangeValue}
                  type="password"
                />
                <SignInInputItem
                  name="password_2_confirm"
                  value={formData.password_2_confirm}
                  placeholder={i18n.confirm}
                  error={formErrors.password_2_confirm}
                  handleChangeValue={handleChangeValue}
                  type="password"
                />
              </div>
              <SignInInputGuide>
                <Link href={emailGuideURL} target="_blank">
                  {i18n.why_we_ask_for_two_passwords}
                </Link>
              </SignInInputGuide>
            </SignInModuleInputArea>
            <SignInModuleBtnRow>
              <Link href={paths.id} className={styles.blueLink}>
                {i18n.already_have_id}
              </Link>
              <Button
                type="button"
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
        );
      }
      case CreateIDStep.CreateIdSuccess: {
        return <Step2 formData={formData} />;
      }
      default:
        <div>Invalid step</div>;
    }
  }, [step, handleClickNext, handleChangeValue, formErrors]);

  return (
    <div className={styles.wrapper}>
      <SignInModule>
        <SignInModuleLogoArea />
        <div>{content}</div>
      </SignInModule>
    </div>
  );
};

export default CreateID;
