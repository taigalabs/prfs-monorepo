"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Tutorial1MD from "@/markdown/tutorial/tutorial_1.mdx";
import { useRouter } from "next/navigation";

import styles from "./TutorialStepper.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";

const TutorialStepper: React.FC<TutorialStepperProps> = ({ children, stages }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const stage = React.useMemo(() => {
    const s = searchParams.get("tutorial");
    if (s) {
      return +s;
    }
  }, [searchParams]);

  const handleClick = React.useCallback(() => {
    if (stage) {
      router.push(`${paths.__}/?tutorial=${stage + 1}`);
    }
  }, [stage, router]);

  return (
    <div className={styles.wrapper} onClick={handleClick}>
      {children}
    </div>
  );
};

export default TutorialStepper;

export interface TutorialStepperProps {
  children: React.ReactNode;
  stages: number[];
}
