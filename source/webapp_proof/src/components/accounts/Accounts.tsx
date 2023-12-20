"use client";

import React from "react";
import cn from "classnames";
import Link from "next/link";
import { useRouter } from "next/navigation";

import styles from "./Accounts.module.scss";
import { i18nContext } from "@/i18n/context";
import { paths } from "@/paths";
import { useSignedInUser } from "@/hooks/user";
import ImageLogo from "@taigalabs/prfs-react-components/src/image_logo/ImageLogo";

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
        <a href={paths.__}>
          <ImageLogo width={180} />
        </a>
      </div>
      <div className={styles.main}>
        <div className={styles.title}>title</div>
      </div>
    </div>
  );
};

export default Accounts;

export interface AccountsProps {}
