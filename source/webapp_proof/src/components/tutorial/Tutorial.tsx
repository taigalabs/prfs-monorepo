"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Tutorial1MD from "@/markdown/tutorial/tutorial_1.mdx";
import Tutorial2MD from "@/markdown/tutorial/tutorial_2.mdx";
import Button from "@taigalabs/prfs-react-components/src/button/Button";

import styles from "./Tutorial.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";

const Stage: React.FC<StageProps> = ({ step }) => {
  const i18n = React.useContext(i18nContext);

  switch (step) {
    case "1":
      return <Tutorial1MD />;
    case "2":
      return <Tutorial2MD />;
    default:
      return <div>Invalid stage</div>;
  }
};

const Tutorial: React.FC<TutorialProps> = () => {
  const searchParams = useSearchParams();
  const i18n = React.useContext(i18nContext);

  const step = React.useMemo(() => {
    const s = searchParams.get("tutorialStep");
    if (s) {
      return s;
    }
  }, [searchParams]);

  return (
    step && (
      <div className={styles.wrapper}>
        <p className={styles.progress}>({step} / 9)</p>
        <Stage step={step} />
        <div className={styles.btnRow}>
          <Button variant="transparent_aqua_blue_1">{i18n.prev}</Button>
          <Button variant="aqua_blue_1">{i18n.next}</Button>
        </div>
      </div>
    )
  );
};

export default Tutorial;

export interface TutorialProps {}

export interface StageProps {
  step: string;
}
