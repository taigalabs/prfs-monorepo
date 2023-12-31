import React, { Suspense } from "react";

import styles from "./page.module.scss";
import { envs } from "@/envs";

const HomePage = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>Prfs identity</div>
      <p>
        <span>Launch timestamp </span>
        <span>{envs.NEXT_PUBLIC_LAUNCH_TIMESTAMP}</span>
      </p>
      <p>
        <span>Commit hash </span>
        <span>{envs.NEXT_PUBLIC_GIT_COMMIT_HASH}</span>
      </p>
    </div>
  );
};

export default HomePage;
