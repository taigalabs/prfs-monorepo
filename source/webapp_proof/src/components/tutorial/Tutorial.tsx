"use client";

import React from "react";
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";
import Tutorial1MD from "@/markdown/tutorial/tutorial_1.mdx";
import Tutorial2MD from "@/markdown/tutorial/tutorial_2.mdx";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import { useRouter } from "next/navigation";

import styles from "./Tutorial.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";

const STEP_COUNT = 9;

const Stage: React.FC<StageProps> = ({ step }) => {
  const i18n = React.useContext(i18nContext);

  switch (step) {
    case 1:
      return <Tutorial1MD />;
    case 2:
      return <Tutorial2MD />;
    default:
      return <div>Invalid stage</div>;
  }
};

const Tutorial: React.FC<TutorialProps> = () => {
  const searchParams = useSearchParams();
  const i18n = React.useContext(i18nContext);
  const router = useRouter();

  const isTutorial = React.useMemo(() => {
    const s = searchParams.get("tutorial_id");
    if (s !== null) {
      return true;
    }
    return false;
  }, [searchParams]);

  const handleClickPrev = React.useCallback(() => {
    if (step && step > 0) {
      router.push(`${paths.__}/?tutorialStep=${Math.max(step - 1, 0)}`);
    }
  }, [step, router]);

  const handleClickNext = React.useCallback(() => {}, [step]);

  if (step && step < 1) {
    router.replace(`${paths.__}/?tutorialStep=1`);
  }

  return (
    step &&
    step > 0 && (
      <div className={styles.wrapper}>
        <p className={styles.progress}>({step} / 9)</p>
        <Stage step={step} />
        <div className={styles.btnRow}>
          <Button variant="transparent_aqua_blue_1" handleClick={handleClickPrev}>
            {i18n.prev}
          </Button>
          <Link href={`${paths.__}/?tutorialStep=${Math.min(step + 1, STEP_COUNT)}`}>
            <Button variant="aqua_blue_1">{i18n.next}</Button>
          </Link>
        </div>
      </div>
    )
  );
};

export default Tutorial;

export interface TutorialProps {}

export interface StageProps {
  step: number;
}
