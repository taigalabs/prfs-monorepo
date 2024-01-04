"use client";

import React from "react";
import { AiOutlineClose } from "@react-icons/all-files/ai/AiOutlineClose";
import cn from "classnames";
import { IoMdSchool } from "@react-icons/all-files/io/IoMdSchool";

import styles from "./TutorialInner.module.scss";
import TutorialMarkdown from "./TutorialMarkdown";
import { i18nContext } from "../i18n/i18nContext";
import Tutorial1MD from "../tutorial_contents/tutorial_1.mdx";
import Tutorial2MD from "../tutorial_contents/tutorial_2.mdx";
import Tutorial3MD from "../tutorial_contents/tutorial_3.mdx";
import Tutorial4MD from "../tutorial_contents/tutorial_4.mdx";
import Tutorial5MD from "../tutorial_contents/tutorial_5.mdx";
import Button from "../button/Button";

const STEP_COUNT = 5;

const Stage: React.FC<StageProps> = ({ step }) => {
  switch (step) {
    case 1:
      return <Tutorial1MD />;
    case 2:
      return <Tutorial2MD />;
    case 3:
      return <Tutorial3MD />;
    case 4:
      return <Tutorial4MD />;
    case 5:
      return <Tutorial5MD />;
    default:
      return <div>Invalid stage</div>;
  }
};

const TutorialInner: React.FC<TutorialInnerProps> = ({
  step,
  handleClickPrev,
  handleClickNext,
  handleClickClose,
}) => {
  const i18n = React.useContext(i18nContext);
  const isLastStep = step === STEP_COUNT;
  const bodyRef = React.useRef<HTMLDivElement | null>(null);

  const enhancedHandleClickNext = React.useCallback(() => {
    handleClickNext();
    if (bodyRef.current) {
      bodyRef.current.scrollTo(0, 0);
    }
  }, [handleClickNext]);

  const enhancedHandleClickPrev = React.useCallback(() => {
    handleClickPrev();
    if (bodyRef.current) {
      bodyRef.current.scrollTo(0, 0);
    }
  }, [handleClickPrev]);

  return (
    step > 0 && (
      <div className={styles.inner}>
        <div className={styles.titleBar}>
          <div className={styles.imgBox}>
            <IoMdSchool />
          </div>
          <div className={styles.label}>
            <p className={styles.smallFont}>{i18n.learn.toUpperCase()}</p>
            <p>{i18n.tutorial}</p>
          </div>
          <button className={styles.imgBox}>
            <AiOutlineClose onClick={handleClickClose} />
          </button>
        </div>
        <div className={styles.header}>
          <p className={styles.progress}>
            Step {step} of {STEP_COUNT}
          </p>
        </div>
        <div className={styles.body} ref={bodyRef}>
          <TutorialMarkdown>
            <Stage step={step} />
          </TutorialMarkdown>
          <div className={styles.btnRow}>
            <Button
              className={styles.prevBtn}
              variant="transparent_blue_2"
              handleClick={enhancedHandleClickPrev}
              disabled={step === 1}
              type="button"
            >
              {i18n.prev}
            </Button>
            {isLastStep ? (
              <Button
                className={styles.finishBtn}
                variant="transparent_aqua_blue_1"
                handleClick={handleClickClose}
                type="button"
              >
                {i18n.finish}
              </Button>
            ) : (
              <Button
                variant="blue_2"
                handleClick={enhancedHandleClickNext}
                className={styles.nextBtn}
                type="button"
              >
                {i18n.next}
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default TutorialInner;

export interface TutorialInnerProps {
  step: number;
  handleClickClose: () => void;
  handleClickPrev: () => void;
  handleClickNext: () => void;
}

export interface StageProps {
  step: number;
}
