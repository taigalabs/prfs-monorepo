"use client";

import React from "react";
import { useRouter } from "next/navigation";

import styles from "./SignIn.module.scss";
import ShyLogo from "@/components/shy_logo/ShyLogo";
import ShyLandingIntro from "./ShyLandingIntro.mdx";
import SigningInGuideline from "./SigningInGuideline.mdx";
import PrfsIdSignInBtn from "@/components/prfs_sign_in_btn/PrfsSignInBtn";
import { useSignedInUser } from "@/hooks/user";
import { paths } from "@/paths";
import SignInFooter from "../sign_in_footer/SignInFooter";
import { useI18N } from "@/i18n/hook";

const SignIn: React.FC<SignInProps> = () => {
  const i18n = useI18N();
  const { shyCredential } = useSignedInUser();
  const router = useRouter();

  React.useEffect(() => {
    if (shyCredential) {
      router.push(paths.__);
    }
  }, [shyCredential]);

  return shyCredential ? (
    <div>Redirecting...</div>
  ) : (
    <div className={styles.wrapper}>
      <div className={styles.upper}>
        <div className={styles.logoPane}>
          <div className={styles.logoWrapper}>
            <ShyLogo className={styles.logo} />
          </div>
        </div>
        <div className={styles.main}>
          <div className={styles.intro}>
            <p>{i18n.more_honest_discussions}</p>
          </div>
          <ul className={styles.signInBtnRow}>
            <li>
              <PrfsIdSignInBtn />
            </li>
          </ul>
          <div className={styles.guideline}>
            <SigningInGuideline />
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <SignInFooter />
      </div>
    </div>
  );
};

export default SignIn;

export interface SignInProps {}
