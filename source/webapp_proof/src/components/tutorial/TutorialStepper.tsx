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
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
} from "@floating-ui/react";

import styles from "./TutorialStepper.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";

const TutorialStepper: React.FC<TutorialStepperProps> = ({ children, stages }) => {
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = React.useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "top-start",
    // Make sure the tooltip stays on the screen
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({
        fallbackAxisSideDirection: "start",
      }),
      shift(),
    ],
  });

  // Event listeners to change the open state
  const hover = useHover(context, { move: false });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  // Role props for screen readers
  const role = useRole(context, { role: "tooltip" });

  // Merge all the interactions into prop getters
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role]);

  const stage = React.useMemo(() => {
    const s = searchParams.get("tutorial");
    if (s) {
      return +s;
    } else {
      return -1;
    }
  }, [searchParams]);

  return stages.includes(stage) ? (
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

  // return stages.includes(stage) ? <div className={styles.wrapper}>{children}</div> : children;
};

export default TutorialStepper;

export interface TutorialStepperProps {
  children: React.ReactNode;
  stages: number[];
}
