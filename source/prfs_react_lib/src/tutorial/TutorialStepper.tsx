"use client";

import React from "react";
import cn from "classnames";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
} from "@floating-ui/react";

import styles from "./TutorialStepper.module.scss";
// import { i18nContext } from "../i18n/context";
// import { paths } from "@/paths";
// import { useAppSelector } from "@/state/hooks";

const TutorialStepper: React.FC<TutorialStepperProps> = ({
  isVisible,
  children,
  step,
  steps,
  fullWidth,
  mainAxisOffset,
  crossAxisOffset,
}) => {
  // const searchParams = useSearchParams();

  // const isTutorial = React.useMemo(() => {
  //   if (searchParams.get("tutorial_id")) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }, [searchParams]);

  // const step = useAppSelector(state => state.tutorial.tutorialStep);

  const { refs, floatingStyles, context } = useFloating({
    placement: "top-start",
    whileElementsMounted: autoUpdate,
    middleware: [
      offset({
        mainAxis: mainAxisOffset || 10,
        crossAxis: crossAxisOffset || 5,
      }),
      flip({
        fallbackAxisSideDirection: "start",
      }),
      shift(),
    ],
  });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });
  const { getReferenceProps, getFloatingProps } = useInteractions([focus, dismiss, role]);

  return isVisible && steps.includes(step) ? (
    <>
      <div
        className={cn({ [styles.wrapper]: true, [styles.fullWidth]: fullWidth })}
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        {children}
      </div>
      <FloatingPortal>
        <div
          className={styles.tooltip}
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
        ></div>
      </FloatingPortal>
    </>
  ) : (
    children
  );
};

export default TutorialStepper;

export interface TutorialStepperProps {
  isVisible: boolean;
  step: number;
  children: React.ReactNode;
  steps: number[];
  fullWidth?: boolean;
  mainAxisOffset?: number;
  crossAxisOffset?: number;
}
