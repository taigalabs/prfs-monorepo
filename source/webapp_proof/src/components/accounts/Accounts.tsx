"use client";

import React from "react";
import cn from "classnames";
import Link from "next/link";
import { useRouter } from "next/navigation";

import styles from "./Attestations.module.scss";
import { i18nContext } from "@/i18n/context";
import { paths } from "@/paths";
import { useSignedInUser } from "@/hooks/user";

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

  return <div>power</div>;
};

export default Accounts;

export interface AccountsProps {}
