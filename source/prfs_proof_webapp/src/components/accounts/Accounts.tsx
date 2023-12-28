"use client";

import React from "react";
import cn from "classnames";
import Link from "next/link";
import ImageLogo from "@taigalabs/prfs-react-components/src/image_logo/ImageLogo";
import { useRouter } from "next/navigation";

import styles from "./Accounts.module.scss";
import { i18nContext } from "@/i18n/context";
import { paths } from "@/paths";
import { useSignedInUser } from "@/hooks/user";
import PrfsIdSignInBtn from "@/components/prfs_id/prfs_id_sign_in_btn/PrfsIdSignInBtn";

const Accounts: React.FC<AccountsProps> = ({}) => {
  const i18n = React.useContext(i18nContext);
  const { isCredentialInitialized, prfsProofCredential } = useSignedInUser();
  const router = useRouter();

  React.useEffect(() => {
    if (isCredentialInitialized) {
      if (prfsProofCredential !== null) {
        router.push(paths.__);
      }
    }
  }, [isCredentialInitialized, prfsProofCredential, router]);

  if (!isCredentialInitialized) {
    <div>Loading...</div>;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.logoArea}>
        <ImageLogo width={180} />
      </div>
      <div className={styles.main}>
        <div className={styles.title}>{i18n.sign_in_to_prfs}</div>
        <div className={styles.subtitle}>
          {i18n.some_functionalities_are_available_only_with_user_signed_in}
        </div>
        <ul className={styles.signInMenu}>
          <li className={styles.item}>
            <PrfsIdSignInBtn
              className={styles.prfsIDSignInBtn}
              label={i18n.sign_in_with_prfs_id}
              noCredential
            />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Accounts;

export interface AccountsProps {}
