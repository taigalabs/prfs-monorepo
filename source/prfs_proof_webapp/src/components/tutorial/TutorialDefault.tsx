"use client";

import React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Tutorial1MD from "@/components/tutorial_contents/tutorial_1.mdx";
import Tutorial2MD from "@/components/tutorial_contents/tutorial_2.mdx";
import Tutorial3MD from "@/components/tutorial_contents/tutorial_3.mdx";
import Tutorial4MD from "@/components/tutorial_contents/tutorial_4.mdx";
import Tutorial5MD from "@/components/tutorial_contents/tutorial_5.mdx";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import Tutorial from "@taigalabs/prfs-react-lib/src/tutorial/Tutorial";
import { AiOutlineClose } from "@react-icons/all-files/ai/AiOutlineClose";
import { useRouter } from "next/navigation";
import cn from "classnames";
import { IoMdSchool } from "@react-icons/all-files/io/IoMdSchool";
import { useIsTutorial } from "@taigalabs/prfs-react-lib/src/hooks/tutorial";

import styles from "./TutorialDefault.module.scss";
import { i18nContext } from "@/i18n/context";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { goNextStep, goPrevStep, resetStep } from "@/state/tutorialReducer";
import TutorialMarkdown from "./TutorialMarkdown";

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

  // const isLastStep = step === STEP_COUNT;

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

  // return (
  //   isTutorial &&
  //   step > 0 && (
  //     <>
  //       <div
  //         className={cn(styles.wrapper, {
  //           [styles.noTop]: !!noTop,
  //         })}
  //       >
  //         <div className={styles.inner}>
  //           <div className={styles.titleBar}>
  //             <div className={styles.imgBox}>
  //               <IoMdSchool />
  //             </div>
  //             <div className={styles.label}>
  //               <p className={styles.smallFont}>{i18n.learn.toUpperCase()}</p>
  //               <p>{i18n.tutorial}</p>
  //             </div>
  //             <button className={styles.imgBox}>
  //               <AiOutlineClose onClick={handleClickClose} />
  //             </button>
  //           </div>
  //           <div className={styles.header}>
  //             <p className={styles.progress}>
  //               Step {step} of {STEP_COUNT}
  //             </p>
  //           </div>
  //           <div className={styles.body}>
  //             <TutorialMarkdown>
  //               <Stage step={step} />
  //             </TutorialMarkdown>
  //             <div className={styles.btnRow}>
  //               <Button
  //                 variant="transparent_aqua_blue_1"
  //                 handleClick={handleClickPrev}
  //                 disabled={step === 1}
  //               >
  //                 {i18n.prev}
  //               </Button>
  //               {isLastStep ? (
  //                 <Button
  //                   className={styles.finishBtn}
  //                   variant="transparent_aqua_blue_1"
  //                   handleClick={handleClickClose}
  //                 >
  //                   {i18n.finish}
  //                 </Button>
  //               ) : (
  //                 <Button variant="aqua_blue_1" handleClick={handleClickNext}>
  //                   {i18n.next}
  //                 </Button>
  //               )}
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </>
  //   )
  // );
};

export default TutorialDefault;

export interface TutorialDefaultProps {
  noTop?: boolean;
}

export interface StageProps {
  step: number;
}
