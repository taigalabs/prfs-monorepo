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
import { i18nContext } from "../i18n/i18nContext";

const Modal: React.FC<MerkleProofModalProps> = ({}) => {
  const i18n = React.useContext(i18nContext);

  return <div className={styles.modal}>power</div>;
};

const PrfsCredentialPopover: React.FC<PrfsCredentialPopoverProps> = ({
  className,
  credential,
  isOpenClassName,
  handleInitFail,
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
  const [printable, setPrintable] = React.useState<{ label: string; avatarColor: string }>({
    label: "",
    avatarColor: "",
  });

  console.log(11, credential);

  React.useEffect(() => {
    if (credential && credential.id.length > 6) {
      const label = credential.id.substring(2, 6);
      const { avatarColor } = credential;
      setPrintable({ label, avatarColor });
    } else {
      handleInitFail();
    }
  }, [credential, setPrintable]);

  return (
    printable && (
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
          {printable.label}
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
    )
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
  handleInitFail: () => void;
}

export interface MerkleProofModalProps {
  setIsOpen: React.Dispatch<React.SetStateAction<any>>;
}
