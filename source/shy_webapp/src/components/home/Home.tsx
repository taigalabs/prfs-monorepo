"use client";

import React from "react";
import { useRouter } from "next/navigation";

import styles from "./Home.module.scss";
import { useSignedInShyUser } from "@/hooks/user";
import { paths } from "@/paths";
import { useIsFontReady } from "@/hooks/font";
import Loading from "../loading/Loading";

const Home: React.FC<HomeProps> = () => {
  const isFontReady = useIsFontReady();
  const { isInitialized, shyCredential } = useSignedInShyUser();
  const router = useRouter();

  React.useEffect(() => {
    if (isInitialized && !shyCredential) {
      router.push(`${paths.account__sign_in}`);
    }
  }, [isInitialized, router, shyCredential]);

  return isFontReady && shyCredential ? (
    <div></div>
  ) : (
    <>
      <Loading />
      <span className={styles.fontLoadText} />
    </>
  );
};

export default Home;

export interface HomeProps {}
