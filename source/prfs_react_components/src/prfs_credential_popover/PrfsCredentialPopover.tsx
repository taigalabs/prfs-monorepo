import React, { useId } from "react";
import cn from "classnames";
import { GrMonitor } from "@react-icons/all-files/gr/GrMonitor";
import { FaVoteYea } from "@react-icons/all-files/fa/FaVoteYea";
import { BsThreeDots } from "@react-icons/all-files/bs/BsThreeDots";
import {
  FloatingFocusManager,
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

import styles from "./PrfsCredentialPopover.module.scss";
import { TbMathPi } from "../tabler_icons/TbMathPi";
import { i18nContext } from "../contexts/i18nContext";

const Modal: React.FC<MerkleProofModalProps> = ({}) => {
  const i18n = React.useContext(i18nContext);

  return <div className={styles.modal}>power</div>;
};

const PrfsCredentialPopover: React.FC<PrfsCredentialPopoverProps> = ({
  className,
  credential,
  children,
  isOpenClassName,
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
    <>
      <button
        className={cn(styles.base, {
          [styles.isOpen]: isOpen,
          [className!]: !!className,
          [isOpenClassName!]: !!isOpenClassName && isOpen,
        })}
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        {children ? children : <BsThreeDots />}
      </button>
      {isOpen && (
        <FloatingFocusManager context={context} modal={false}>
          <div
            className={styles.popoverWrapper}
            ref={refs.setFloating}
            style={floatingStyles}
            aria-labelledby={headingId}
            {...getFloatingProps()}
          >
            <Modal setIsOpen={setIsOpen} />
          </div>
        </FloatingFocusManager>
      )}
    </>
  );
};

export default PrfsCredentialPopover;

export interface PrfsCredentialPopoverProps {
  credential: {
    id: string;
    avatarColor: string;
  };
  className?: string;
  isOpenClassName?: string;
  zIndex?: number;
  children?: React.ReactNode;
}

export interface MerkleProofModalProps {
  setIsOpen: React.Dispatch<React.SetStateAction<any>>;
}
