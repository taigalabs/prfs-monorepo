import React from "react";
import cn from "classnames";
import {
  offset as offset_fn,
  useFloating,
  useClick,
  useInteractions,
  useDismiss,
  flip,
  Placement,
} from "@floating-ui/react";
import { AiFillTwitterSquare } from "@react-icons/all-files/ai/AiFillTwitterSquare";
import { FaTelegram } from "@react-icons/all-files/fa/FaTelegram";
import { FaDiscord } from "@react-icons/all-files/fa/FaDiscord";

import styles from "./SocialSharePopover.module.scss";
import Button from "../button/Button";

function SocialSharePopover({ placement, offset, popoverClassName }: SocialSharePopoverProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { refs, floatingStyles, context } = useFloating({
    placement: placement ? placement : "bottom-start",
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [flip(), offset_fn(offset ? offset : 3)],
  });
  const dismiss = useDismiss(context);
  const click = useClick(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

  // const popoverElem = React.useMemo(() => {
  //   return createPopover(setIsOpen);
  // }, [createPopover]);

  // const baseElem = React.useMemo(() => {
  //   return createBase(isOpen);
  // }, [createBase, isOpen]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.base} ref={refs.setReference} {...getReferenceProps()} role="button">
        <Button variant="transparent_black_1">SHARE</Button>
      </div>
      {isOpen && (
        <div
          className={cn(styles.popover, popoverClassName, "1")}
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          <ul>
            <li>
              <AiFillTwitterSquare />
              <span>Twitter</span>
            </li>
            <li>
              <FaTelegram />
              <span>Telegram</span>
            </li>
            <li>
              <FaDiscord />
              <span>Discord</span>
            </li>
          </ul>
          {/* {popoverElem} */}
        </div>
      )}
    </div>
  );
}

export default SocialSharePopover;

export interface SocialSharePopoverProps {
  // createBase: (isOpen: boolean) => React.ReactNode;
  offset?: number;
  // createPopover: (setIsOpen: React.Dispatch<React.SetStateAction<any>>) => React.ReactNode;
  popoverClassName?: string;
  placement?: Placement;
}
