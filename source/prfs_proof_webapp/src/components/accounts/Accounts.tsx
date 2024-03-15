"use client";

import React from "react";
import cn from "classnames";
import ImageLogo from "@taigalabs/prfs-react-lib/src/image_logo/ImageLogo";
import { useRouter } from "next/navigation";

import styles from "./Accounts.module.scss";
import { i18nContext } from "@/i18n/context";
import { paths } from "@/paths";
import { useSignedInProofUser } from "@/hooks/user";
import PrfsIdSignInBtn from "@/components/prfs_id_sign_in_btn/PrfsIdSignInBtn";

const Accounts: React.FC<AccountsProps> = ({ appId }) => {
  const i18n = React.useContext(i18nContext);
  const { isInitialized, prfsProofCredential } = useSignedInProofUser();
  const router = useRouter();

  React.useEffect(() => {
    if (isInitialized) {
      if (prfsProofCredential !== null) {
        router.push(paths.__);
      }
    }
  }, [isInitialized, prfsProofCredential, router]);

  if (!isInitialized) {
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
              appId={appId}
            />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Accounts;

export interface AccountsProps {
  appId: string;
}
