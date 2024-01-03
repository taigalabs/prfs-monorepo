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
import { IoMdArrowDropdown } from "@react-icons/all-files/io/IoMdArrowDropdown";

import Fade from "../fade/Fade";
import styles from "./SocialSharePopover.module.scss";
import Button from "../button/Button";
import { i18nContext } from "../i18n/i18nContext";

function SocialSharePopover({ placement, offset, variant }: SocialSharePopoverProps) {
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
          <span>{i18n.share}</span>
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
            <p className={styles.notSupported}>{i18n.not_supported}</p>
            {/*   <li> */}
            {/*     <AiFillTwitterSquare /> */}
            {/*     <span>Twitter</span> */}
            {/*   </li> */}
            {/*   <li> */}
            {/*     <FaTelegram /> */}
            {/*     <span>Telegram</span> */}
            {/*   </li> */}
            {/*   <li> */}
            {/*     <FaDiscord /> */}
            {/*     <span>Discord</span> */}
            {/*   </li> */}
          </ul>
        </div>
      )}
    </>
  );
}

export default SocialSharePopover;

export interface SocialSharePopoverProps {
  variant?: "transparent_blue_1" | "transparent_black_1";
  offset?: number;
  placement?: Placement;
}
