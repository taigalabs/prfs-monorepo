"use client";

import React from "react";
import { useRouter } from "next/navigation";
import cn from "classnames";

import styles from "./Welcome.module.scss";
import Content from "./Welcome.mdx";
import { useSignedInProofUser } from "@/hooks/user";
import { paths } from "@/paths";

const Welcome: React.FC<WelcomeProps> = ({}) => {
  const router = useRouter();
  const { isInitialized, prfsProofCredential } = useSignedInProofUser();

  React.useEffect(() => {
    if (isInitialized && !prfsProofCredential) {
      router.push(paths.__);
    }
  }, [isInitialized, prfsProofCredential, router]);

  return (
    prfsProofCredential && (
      <div className={styles.wrapper}>
        <div className={styles.inner}>
          <Content
            accountId={prfsProofCredential?.account_id}
            attestationLink={paths.attestations__create__crypto_asset_size}
          />
        </div>
      </div>
    )
  );
};

export default Welcome;

export interface WelcomeProps {}
