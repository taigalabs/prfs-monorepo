import React from "react";
import Logo from "@taigalabs/prfs-react-components/src/logo/Logo";
import { FaSearch } from "@react-icons/all-files/fa/FaSearch";
import Link from "next/link";
import ActiveLink from "@taigalabs/prfs-react-components/src/active_link/ActiveLink";

import styles from "./SignInForm.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";

const SignInForm: React.FC<{}> = () => {
  const i18n = React.useContext(i18nContext);

  const handleClickSignUp = React.useCallback(() => {}, []);

  const handleClickSignIn = React.useCallback(() => {}, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <p className={styles.bigLogo}>{i18n.vacade}</p>
      </div>
      <div className={styles.right}>
        <button className={styles.signUpBtn} onClick={handleClickSignUp}>
          <p>{i18n.sign_up_with_zauth}</p>
        </button>
        <button className={styles.signInBtn} onClick={handleClickSignIn}>
          <p>{i18n.sign_in_with_zauth}</p>
        </button>
      </div>
    </div>
  );
};

export default SignInForm;
