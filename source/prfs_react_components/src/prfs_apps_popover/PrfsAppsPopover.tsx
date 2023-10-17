"use client";

import React, { useId } from "react";
import cn from "classnames";
import Link from "next/link";
import { GrMonitor } from "@react-icons/all-files/gr/GrMonitor";
import { FaVoteYea } from "@react-icons/all-files/fa/FaVoteYea";
import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from "@floating-ui/react";

import styles from "./PrfsAppsPopover.module.scss";
import IconButton from "../icon_button/IconButton";
import Popover from "../popover/Popover";
import { TbMathPi } from "../tabler_icons/TbMathPi";
import Fade from "../fade/Fade";

const i18n = {
  proof: "Proof",
  poll: "Poll",
  console: "Console",
};

const Modal: React.FC<MerkleProofModalProps> = ({
  webappProofEndpoint,
  webappConsoleEndpoint,
  webappPollEndpoint,
}) => {
  return (
    <ul className={styles.modal}>
      <li>
        <a className={styles.appEntry} href={webappProofEndpoint}>
          <TbMathPi />
          <span>{i18n.proof}</span>
        </a>
      </li>
      <li>
        <a className={styles.appEntry} href={webappConsoleEndpoint}>
          <GrMonitor />
          <span>{i18n.console}</span>
        </a>
      </li>
      {/* <li> */}
      {/*   <a className={styles.appEntry} href={webappPollEndpoint}> */}
      {/*     <FaVoteYea /> */}
      {/*     <span>{i18n.poll}</span> */}
      {/*   </a> */}
      {/* </li> */}
    </ul>
  );
};

const PrfsAppsPopover: React.FC<PrfsAppsPopoverProps> = ({
  webappProofEndpoint,
  webappConsoleEndpoint,
  webappPollEndpoint,
  zIndex,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "bottom-end",
    middleware: [offset(10), flip({ fallbackAxisSideDirection: "end" }), shift()],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  const headingId = useId();

  return (
    <div className={styles.wrapper}>
      <div ref={refs.setReference} {...getReferenceProps()}>
        <IconButton
          className={cn({
            [styles.isOpen]: isOpen,
          })}
          variant="hamburger"
        />
      </div>
      {isOpen && (
        <FloatingFocusManager context={context} modal={false}>
          <div
            className={styles.popoverWrapper}
            ref={refs.setFloating}
            style={floatingStyles}
            aria-labelledby={headingId}
            {...getFloatingProps()}
          >
            <Modal
              setIsOpen={setIsOpen}
              webappProofEndpoint={webappProofEndpoint}
              webappConsoleEndpoint={webappConsoleEndpoint}
              webappPollEndpoint={webappPollEndpoint}
            />
          </div>
        </FloatingFocusManager>
      )}
    </div>
  );
};

export default PrfsAppsPopover;

export interface PrfsAppsPopoverProps {
  webappPollEndpoint: string;
  webappProofEndpoint: string;
  webappConsoleEndpoint: string;
  zIndex?: number;
}

export interface MerkleProofModalProps {
  setIsOpen: React.Dispatch<React.SetStateAction<any>>;
  webappPollEndpoint: string;
  webappProofEndpoint: string;
  webappConsoleEndpoint: string;
}
