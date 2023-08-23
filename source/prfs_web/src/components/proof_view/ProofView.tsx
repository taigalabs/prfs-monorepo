import React from "react";
import * as prfsApi from "@taigalabs/prfs-api-js";
import Link from "next/link";
import Head from "next/head";

import styles from "./ProofView.module.scss";
import { i18nContext } from "@/contexts/i18n";

const ProofView: React.FC<ProofViewProps> = ({ proof }) => {
  let i18n = React.useContext(i18nContext);

  const proofElem = React.useMemo(() => {
    const el = Buffer.from(proof).toString("hex");
    return el;
  }, [proof]);

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className={styles.wrapper}>
        <div className={styles.value}>{proofElem}</div>
      </div>
    </>
  );
};

export default ProofView;

interface ProofViewProps {
  proof: number[];
}
