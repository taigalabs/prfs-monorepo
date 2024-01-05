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

const TutorialStepper: React.FC<TutorialStepperProps> = ({
  tutorialId,
  children,
  step,
  steps,
  fullWidth,
  mainAxisOffset,
  crossAxisOffset,
}) => {
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

  return tutorialId && step && steps.includes(step) ? (
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
  tutorialId: string | null;
  step: number | null;
  children: React.ReactNode;
  steps: number[];
  fullWidth?: boolean;
  mainAxisOffset?: number;
  crossAxisOffset?: number;
}
