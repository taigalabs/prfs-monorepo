"use client";

import React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Tutorial from "@taigalabs/prfs-react-lib/src/tutorial/Tutorial";
import { useRouter } from "next/navigation";
import { useIsTutorial } from "@taigalabs/prfs-react-lib/src/hooks/tutorial";

import styles from "./TutorialDefault.module.scss";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { goNextStep, goPrevStep, resetStep } from "@/state/tutorialReducer";

const STEP_COUNT = 5;

const TutorialDefault: React.FC<TutorialDefaultProps> = ({ noTop }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  // const i18n = React.useContext(i18nContext);
  const dispatch = useAppDispatch();
  const step = useAppSelector(state => state.tutorial.tutorialStep);
  const isTutorial = useIsTutorial();

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
    const oldParams = searchParams.toString();
    const newParams = new URLSearchParams(oldParams);
    newParams.delete("tutorial_id");

    router.replace(`${pathname}?${newParams.toString()}`);
    dispatch(resetStep());
  }, [pathname, router, searchParams, dispatch]);

  return (
    isTutorial && (
      <Tutorial
        noTop={noTop}
        step={step}
        handleClickClose={handleClickClose}
        handleClickNext={handleClickNext}
        handleClickPrev={handleClickPrev}
      />
    )
  );
};

export default TutorialDefault;

export interface TutorialDefaultProps {
  noTop?: boolean;
}

export interface StageProps {
  step: number;
}
