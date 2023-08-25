import React from "react";
import * as prfsApi from "@taigalabs/prfs-api-js";
import Link from "next/link";
import Head from "next/head";

import styles from "./ProofView.module.scss";
import { i18nContext } from "@/contexts/i18n";

const DEFAULT_LENGTH = 32;

const ProofView: React.FC<ProofViewProps> = ({ proof }) => {
  const i18n = React.useContext(i18nContext);
  const [showMore, setShowMore] = React.useState(false);

  const proofElem = React.useMemo(() => {
    let buf;
    if (!showMore) {
      buf = Buffer.from(proof.slice(DEFAULT_LENGTH));
    } else {
      buf = Buffer.from(proof);
    }

    const el = buf.toString("hex");
    return el;
  }, [proof, showMore]);

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className={styles.wrapper}>
        <div className={styles.value}>
          {proofElem}
          <span>{i18n.show_more}</span>
        </div>
      </div>
    </>
  );
};

export default ProofView;

interface ProofViewProps {
  proof: number[];
}
