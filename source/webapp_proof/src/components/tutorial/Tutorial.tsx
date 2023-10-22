"use client";

import React from "react";
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";
import Tutorial1MD from "@/components/tutorial_contents/tutorial_1.mdx";
import Tutorial2MD from "@/components/tutorial_contents/tutorial_2.mdx";
import Tutorial3MD from "@/components/tutorial_contents/tutorial_3.mdx";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import { AiOutlineClose } from "@react-icons/all-files/ai/AiOutlineClose";
import { useRouter } from "next/navigation";

import styles from "./Tutorial.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { goNextStep, goPrevStep } from "@/state/tutorialReducer";
import MarkdownWrapper from "./MarkdownWrapper";

const STEP_COUNT = 9;

const Stage: React.FC<StageProps> = ({ step }) => {
  const i18n = React.useContext(i18nContext);

  switch (step) {
    case 1:
      return <Tutorial1MD />;
    case 2:
      return <Tutorial2MD />;
    case 3:
      return <Tutorial3MD />;
    default:
      return <div>Invalid stage</div>;
  }
};

const Tutorial: React.FC<TutorialProps> = () => {
  const searchParams = useSearchParams();
  const i18n = React.useContext(i18nContext);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const step = useAppSelector(state => state.tutorial.tutorialStep);

  const isTutorial = React.useMemo(() => {
    const s = searchParams.get("tutorial_id");
    if (s !== null) {
      return true;
    }
    return false;
  }, [searchParams]);

  const handleClickPrev = React.useCallback(() => {
    if (step > 1) {
      dispatch(goPrevStep());
    }
  }, [step, router, dispatch]);

  const handleClickNext = React.useCallback(() => {
    if (step < STEP_COUNT) {
      dispatch(goNextStep());
    }
  }, [step, router, dispatch]);

  const handleClickClose = React.useCallback(() => {
    // router.refresh()
    // router.replace()
    const a = searchParams.toString();

    const b = new URLSearchParams(a);
    b.delete("tutorial_id");
    const c = b.toString();
    console.log(11, a, b, c);
  }, [router, searchParams]);

  return (
    isTutorial &&
    step > 0 && (
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <p className={styles.progress}>({step} / 9)</p>
          <button>
            <AiOutlineClose onClick={handleClickClose} />
          </button>
        </div>
        <MarkdownWrapper>
          <Stage step={step} />
        </MarkdownWrapper>
        <div className={styles.btnRow}>
          <Button
            variant="transparent_aqua_blue_1"
            handleClick={handleClickPrev}
            disabled={step === 1}
          >
            {i18n.prev}
          </Button>
          <Button variant="aqua_blue_1" handleClick={handleClickNext}>
            {i18n.next}
          </Button>
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
