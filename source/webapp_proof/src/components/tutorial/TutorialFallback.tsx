import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import Tutorial1MD from "@/components/tutorial_contents/tutorial_1.mdx";
import Tutorial2MD from "@/components/tutorial_contents/tutorial_2.mdx";
import Tutorial3MD from "@/components/tutorial_contents/tutorial_3.mdx";
import Tutorial4MD from "@/components/tutorial_contents/tutorial_4.mdx";
import Tutorial5MD from "@/components/tutorial_contents/tutorial_5.mdx";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import { AiOutlineClose } from "@react-icons/all-files/ai/AiOutlineClose";
import { useRouter } from "next/navigation";
import cn from "classnames";

import styles from "./Tutorial.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { goNextStep, goPrevStep, resetStep } from "@/state/tutorialReducer";
import MarkdownWrapper from "./MarkdownWrapper";

async function getData() {
  const data = await fetch("/api");
  console.log(22, data);
}

const TutorialFallback: React.FC<TutorialProps> = async ({ bigTopMargin }) => {
  // const pathname = usePathname();
  // const searchParams = useSearchParams();
  // const router = useRouter();
  // const i18n = React.useContext(i18nContext);
  // const dispatch = useAppDispatch();

  const d = await getData();

  const step = useAppSelector(state => state.tutorial.tutorialStep);

  // const isTutorial = React.useMemo(() => {
  //   const s = searchParams.get("tutorial_id");
  //   if (s !== null) {
  //     return true;
  //   }
  //   return false;
  // }, [searchParams]);

  // const handleClickPrev = React.useCallback(() => {
  //   if (step > 1) {
  //     dispatch(goPrevStep());
  //   }
  // }, [step, router, dispatch]);

  // const handleClickNext = React.useCallback(() => {
  //   if (step < STEP_COUNT) {
  //     dispatch(goNextStep());
  //   }
  // }, [step, router, dispatch]);

  // const handleClickClose = React.useCallback(() => {
  //   const oldParams = searchParams.toString();
  //   const newParams = new URLSearchParams(oldParams);
  //   newParams.delete("tutorial_id");

  //   router.replace(`${pathname}?${newParams.toString()}`);
  //   dispatch(resetStep());
  // }, [pathname, router, searchParams, dispatch]);

  // const isLastStep = step === STEP_COUNT;

  return (
    <>
      <div className={styles.placeholder} />
      <div className={cn(styles.wrapper, { [styles.bigTopMargin]: bigTopMargin })}>
        <div className={styles.header}>
          <p className={styles.progress}>{/* ({step} / {STEP_COUNT}) */}</p>
          <button>
            <AiOutlineClose onClick={() => {}} />
          </button>
        </div>
        <div className={styles.body}>
          <MarkdownWrapper>{/* <Stage step={step} /> */}</MarkdownWrapper>
          <div className={styles.btnRow}>
            <Button variant="transparent_aqua_blue_1" handleClick={() => {}} disabled={step === 1}>
              {/* {i18n.prev} */}
            </Button>
            <Button variant="aqua_blue_1" handleClick={() => {}}>
              {/* {i18n.next} */}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TutorialFallback;

export interface TutorialProps {
  bigTopMargin?: boolean;
}

export interface StageProps {
  step: number;
}
