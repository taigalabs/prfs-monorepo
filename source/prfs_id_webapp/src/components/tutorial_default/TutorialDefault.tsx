"use client";

import React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import TutorialInner from "@taigalabs/prfs-react-lib/src/tutorial/TutorialInner";
import { useRouter } from "next/navigation";
import cn from "classnames";

import styles from "./TutorialDefault.module.scss";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { goNextStep, goPrevStep, resetStep } from "@/state/tutorialReducer";
import { TutorialArgs } from "@taigalabs/prfs-id-sdk-web";

const STEP_COUNT = 5;

const TutorialDefault: React.FC<TutorialDefaultProps> = ({ noTop, tutorial }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const step = useAppSelector(state => state.tutorial.tutorialStep);

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
    tutorial && (
      <div
        className={cn(styles.wrapper, {
          [styles.noTop]: !!noTop,
        })}
      >
        <TutorialInner
          step={step}
          handleClickClose={handleClickClose}
          handleClickNext={handleClickNext}
          handleClickPrev={handleClickPrev}
        />
      </div>
    )
  );
};

export default TutorialDefault;

export interface TutorialDefaultProps {
  noTop?: boolean;
  tutorial: TutorialArgs | undefined;
}

export interface StageProps {
  step: number;
}
