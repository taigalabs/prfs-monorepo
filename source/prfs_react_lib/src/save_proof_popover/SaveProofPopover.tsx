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
import { IoMdArrowDropdown } from "@react-icons/all-files/io/IoMdArrowDropdown";
import { PrfsProof } from "@taigalabs/prfs-entities/bindings/PrfsProof";

import styles from "./SaveProofPopover.module.scss";
import { i18nContext } from "../i18n/i18nContext";
import Snaps from "./Snaps";

function SaveProofPopover({ placement, offset, prfsProof }: SaveProofPopoverProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const i18n = React.useContext(i18nContext);
  const { refs, floatingStyles, context } = useFloating({
    placement: placement ? placement : "bottom-start",
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [flip(), offset_fn(offset ? offset : 3)],
  });
  const dismiss = useDismiss(context);
  const click = useClick(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

  return (
    <>
      <div
        className={cn({ [styles.base]: true, [styles.isOpen]: isOpen })}
        ref={refs.setReference}
        {...getReferenceProps()}
        role="button"
      >
        <button>
          <span>{i18n.save}</span>
          <IoMdArrowDropdown />
        </button>
      </div>
      {isOpen && (
        <div
          className={cn(styles.popover)}
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          <ul className={styles.menuList}>
            <li>
              <Snaps prfsProof={prfsProof} setIsOpen={setIsOpen} />
            </li>
          </ul>
        </div>
      )}
    </>
  );
}

export default SaveProofPopover;

export interface SaveProofPopoverProps {
  offset?: number;
  placement?: Placement;
  prfsProof: PrfsProof;
}
