"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Tutorial1MD from "@/markdown/tutorial/tutorial_1.mdx";
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
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";

const TutorialStepper: React.FC<TutorialStepperProps> = ({ children, steps }) => {
  const searchParams = useSearchParams();

  const { refs, floatingStyles, context } = useFloating({
    placement: "top-start",
    whileElementsMounted: autoUpdate,
    middleware: [
      offset({
        mainAxis: 10,
        crossAxis: 5,
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

  const step = React.useMemo(() => {
    const s = searchParams.get("tutorialStep");
    if (s) {
      return +s;
    } else {
      return -1;
    }
  }, [searchParams]);

  return steps.includes(step) ? (
    <>
      <div className={styles.wrapper} ref={refs.setReference} {...getReferenceProps()}>
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
  children: React.ReactNode;
  steps: number[];
}
