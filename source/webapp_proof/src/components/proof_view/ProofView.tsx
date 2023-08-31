import React from "react";
import * as prfsApi from "@taigalabs/prfs-api-js";
import Link from "next/link";
import Head from "next/head";
import TextButton from "@taigalabs/prfs-react-components/src/text_button/TextButton";

import styles from "./ProofView.module.scss";
import { i18nContext } from "@/contexts/i18n";

const STRIDE = 64;

const ProofView: React.FC<ProofViewProps> = ({ proof }) => {
  const i18n = React.useContext(i18nContext);
  const [showMore, setShowMore] = React.useState(false);

  const proofElem = React.useMemo(() => {
    let buf;
    if (!showMore) {
      buf = Buffer.from(proof.slice(0, STRIDE));
    } else {
      buf = Buffer.from(proof);
    }

    const proofStr = buf.toString("hex");

    let elems = [];
    for (let i = 0; i < proofStr.length; i += STRIDE * 2) {
      const line = (
        <div className={styles.line} key={i}>
          <p>{i}</p>
          <p>{proofStr.slice(i, i + STRIDE * 2)}</p>
        </div>
      );
      elems.push(line);
    }

    return elems;
  }, [proof, showMore]);

  const handleClickShowMore = React.useCallback(() => {
    setShowMore(true);
  }, [setShowMore]);

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
        {!showMore && (
          <TextButton variant="aqua_blue_1" handleClick={handleClickShowMore}>
            {i18n.show_more}
          </TextButton>
        )}
      </div>
    </>
  );
};

export default ProofView;

interface ProofViewProps {
  proof: number[];
}
