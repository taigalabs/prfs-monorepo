"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Tutorial1MD from "@/markdown/tutorial/tutorial_1.mdx";

import styles from "./Tutorial.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";

const Stage: React.FC<StageProps> = ({ stage }) => {
  const i18n = React.useContext(i18nContext);

  switch (stage) {
    case "1":
      return <Tutorial1MD />;
    default:
      return <div>Invalid stage</div>;
  }
};

const Tutorial: React.FC<TutorialProps> = () => {
  const searchParams = useSearchParams();

  const stage = React.useMemo(() => {
    const s = searchParams.get("tutorial");
    if (s) {
      return s;
    }
  }, [searchParams]);

  return (
    stage && (
      <div className={styles.wrapper}>
        <Stage stage={stage} />
      </div>
    )
  );
};

export default Tutorial;

export interface TutorialProps {}

export interface StageProps {
  stage: string;
}
