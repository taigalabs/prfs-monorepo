import React from "react";
import Logo from "@taigalabs/prfs-react-components/src/logo/Logo";
import { FaSearch } from "@react-icons/all-files/fa/FaSearch";
import Link from "next/link";
import ActiveLink from "@taigalabs/prfs-react-components/src/active_link/ActiveLink";
import { ethers } from "ethers";
import { PrfsSDK } from "@taigalabs/prfs-sdk-web";

import styles from "./SignUpForm.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import ProofGenElement from "@taigalabs/prfs-sdk-web/src/proof_gen_element/proof_gen_element";

const prfs = new PrfsSDK("test");

const SignUpForm: React.FC<{}> = () => {
  const i18n = React.useContext(i18nContext);
  const [proofGenElement, setProofGenElement] = React.useState<ProofGenElement>();

  const handleClickSignUp = React.useCallback(() => {
    window.open(`${process.env.NEXT_PUBLIC_PRFS_ZAUTH_ENDPOINT}/sign_up`, "_blank");
    window.addEventListener("message", event => console.log(11, event));
  }, []);

  const handleClickSignIn = React.useCallback(() => {
    window.open(`${process.env.NEXT_PUBLIC_PRFS_ZAUTH_ENDPOINT}/sign_in`, "_blank");
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <p className={styles.bigLogo}>{i18n.vacade}</p>
      </div>
      <div className={styles.right}>
        <div id="prfs-sdk-container"></div>
        123123
        <button className={styles.signInBtn} onClick={handleClickSignIn}>
          <p>{i18n.sign_in_with_zauth}</p>
        </button>
      </div>
    </div>
  );
};

export default SignUpForm;

export interface SignUpFormProps {}
