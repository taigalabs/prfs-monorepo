"use client";

import React from "react";
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";

import styles from "./Tutorial.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";

const Stage: React.FC<StageProps> = ({ stage }) => {
  switch (stage) {
    case "1":
      return <div>power 1</div>;
    default:
      return <div>Invalid stage</div>;
  }
};

const Tutorial: React.FC<TutorialProps> = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const searchParams = useSearchParams();

  const stage = React.useMemo(() => {
    const s = searchParams.get("tutorial");
    if (s) {
      console.log(33, s);
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
