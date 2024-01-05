import React from "react";

import styles from "./CommitHash.module.scss";
import { envs } from "@/envs";

const CommitHash = () => {
  return <div className={styles.wrapper}>{envs.NEXT_PUBLIC_GIT_COMMIT_HASH.substring(0, 6)}</div>;
};

export default CommitHash;
