"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

import styles from "./SignIn.module.scss";
import ShyLogo from "@/components/shy_logo/ShyLogo";
import SigningInGuideline from "./SigningInGuideline.mdx";
import { useSignedInShyUser } from "@/hooks/user";
import { paths, searchParamKeys } from "@/paths";
import SignInFooter from "@/components/sign_in_footer/SignInFooter";
import { useI18N } from "@/i18n/hook";
import ShySignInBtn from "@/components/shy_sign_in_btn/ShySignInBtn";

const SignIn: React.FC<SignInProps> = () => {
  const i18n = useI18N();
  const { shyCredential } = useSignedInShyUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    if (shyCredential) {
      const _continue = searchParams.get(searchParamKeys.continue);
      if (_continue) {
        router.push(_continue);
      }
      router.push(paths.__);
    }
  }, [shyCredential, searchParams]);

  return shyCredential ? (
    <div className={styles.loading}>{i18n.loading}...</div>
  ) : (
    <div className={styles.wrapper}>
      <div className={styles.upper}>
        <div className={styles.logoPane}>
          <div className={styles.logoWrapper}>
            <ShyLogo className={styles.logo} />
          </div>
        </div>
        <div className={styles.main}>
          <div className={styles.mainInner}>
            <div className={styles.intro}>
              <p>{i18n.more_honest_discussions}</p>
            </div>
            <ul className={styles.signInBtnRow}>
              <li className={styles.signInBtnWrapper}>
                <ShySignInBtn />
              </li>
            </ul>
            <div className={styles.guideline}>
              <SigningInGuideline />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <SignInFooter />
      </div>
    </div>
  );
};

export default SignIn;

export interface SignInProps {}
