"use client";

import React from "react";
import Link from "next/link";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { useRouter } from "next/navigation";
import { useFloating, useClick, useInteractions, useDismiss } from "@floating-ui/react";

import styles from "./SetDropdown.module.scss";
import { i18nContext } from "@/contexts/i18n";
import prfsBackend from "@/fetch/prfsBackend";

const SetDropdown: React.FC<SetDropdownProps> = () => {
  const i18n = React.useContext(i18nContext);

  const [isOpen, setIsOpen] = React.useState(false);
  const { refs, floatingStyles, context } = useFloating({
    placement: "bottom-end",
    open: isOpen,
    onOpenChange: setIsOpen,
  });
  const dismiss = useDismiss(context);
  const click = useClick(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

  const handleClickSignOut = React.useCallback(() => {
    console.log("123");
  }, []);

  return (
    <div>
      <div>dropdown</div>
      <div>
        {isOpen && (
          <div
            className={styles.dropdown}
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            <ul>
              power
              <li onClick={handleClickSignOut}>{i18n.sign_out}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SetDropdown;

export interface SetDropdownProps {}
