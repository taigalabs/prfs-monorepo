"use client";

import React from "react";
import Link from "next/link";

import styles from "./Tutorial.module.scss";
import { i18nContext } from "@/contexts/i18n";
import {
  FloatingPortal,
  autoUpdate,
  offset,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from "@floating-ui/react";

const Tutorial: React.FC<TutorialProps> = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  // const { refs, floatingStyles, context } = useFloating({
  //   open: isOpen,
  //   onOpenChange: setIsOpen,
  //   placement: "right",
  //   // Make sure the tooltip stays on the screen
  //   whileElementsMounted: autoUpdate,
  //   middleware: [offset(5)],
  // });

  // // Event listeners to change the open state
  // const hover = useHover(context, { move: false });
  // const focus = useFocus(context);
  // const dismiss = useDismiss(context);
  // // Role props for screen readers
  // const role = useRole(context, { role: "tooltip" });

  // // Merge all the interactions into prop getters
  // const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role]);

  return (
    <div>
      power
      {/* <div className={styles.base} ref={refs.setReference} {...getReferenceProps()}></div> */}
      {/* <FloatingPortal> */}
      {/*   {true && ( */}
      {/*     <div */}
      {/*       className="Tooltip" */}
      {/*       ref={refs.setFloating} */}
      {/*       style={floatingStyles} */}
      {/*       {...getFloatingProps()} */}
      {/*     > */}
      {/*       tutorial */}
      {/*     </div> */}
      {/*   )} */}
      {/* </FloatingPortal> */}
    </div>
  );
};

export default Tutorial;

export interface TutorialProps {}
