"use client";

import React from "react";
import styles from "./SignIn.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { initWasm, makeCredential } from "@taigalabs/prfs-crypto-js";
import SignInModule, {
  SignInForm,
  SignInInputItem,
  SignInModuleBtnRow,
  SignInModuleFooter,
  SignInModuleHeader,
  SignInModuleInputArea,
  SignInModuleLogoArea,
  SignInModuleSubtitle,
  SignInModuleTitle,
} from "@/components/sign_in_module/SignInModule";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SignInSuccessZAuthMsg } from "@taigalabs/prfs-zauth-interface";

import { paths } from "@/paths";
import { envs } from "@/envs";
import {
  IdCreateForm,
  makeEmptyIDCreateFormErrors,
  makeEmptyIdCreateForm,
} from "@/functions/validate_id";

const SignIn: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();

  const handleClickSignIn = React.useCallback(async () => {
    if (formData) {
      const credential = await makeCredential({
        email: formData.email,
        password_1: formData.password_1,
        password_2: formData.password_2,
      });

      console.log("credential", credential);

      const msg: SignInSuccessZAuthMsg = {
        type: "SIGN_IN_SUCCESS",
        payload: {
          id: credential.id,
          publicKey: credential.public_key,
        },
      };

      window.opener.postMessage(msg);
    }
  }, []);

  const handleClickCreateID = React.useCallback(() => {
    const { search } = window.location;
    const url = `${paths.accounts__create}${search}`;
    router.push(url);
  }, [router]);

  const [formData, setFormData] = React.useState<IdCreateForm>(makeEmptyIdCreateForm());
  const [formErrors, setFormErrors] = React.useState<IdCreateForm>(makeEmptyIDCreateFormErrors());

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

  return (
    <SignInModule>
      <SignInForm>
        <SignInModuleLogoArea />
        <SignInModuleHeader>
          <SignInModuleTitle>{i18n.sign_in}</SignInModuleTitle>
          <SignInModuleSubtitle>{i18n.use_your_prfs_identity}</SignInModuleSubtitle>
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
          </div>
          <div className={styles.inputGroup}>
            <SignInInputItem
              name="password_1"
              value={formData.password_1}
              placeholder={i18n.password_1}
              error={formErrors.password_1}
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
          </div>
        </SignInModuleInputArea>
        <SignInModuleBtnRow>
          <Button variant="transparent_blue_2" noTransition handleClick={handleClickCreateID}>
            {i18n.create_id}
          </Button>
          <Button
            type="button"
            variant="blue_2"
            className={styles.signInBtn}
            noTransition
            handleClick={handleClickSignIn}
            noShadow
          >
            {i18n.sign_in}
          </Button>
        </SignInModuleBtnRow>
      </SignInForm>
      <SignInModuleFooter>
        <Link href={envs.NEXT_PUBLIC_CODE_REPOSITORY_URL}>
          <span>{i18n.code}</span>
        </Link>
        <Link href={envs.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}>
          <span>{i18n.prfs}</span>
        </Link>
      </SignInModuleFooter>
    </SignInModule>
  );
};

export default SignIn;
