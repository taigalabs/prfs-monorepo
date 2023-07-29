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

const SetDropdown: React.FC<SetDropdownProps> = ({ handleSelectVal }) => {
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

  const handleClickEntry = React.useCallback(() => {
    console.log("123");
  }, []);

  return (
    <div className={styles.dropdownWrapper}>
      <div className={styles.dropdownBase} ref={refs.setReference} {...getReferenceProps()}>
        <div>dropdown</div>
        <div className={styles.arrowContainer}>
          {isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        </div>
      </div>
      {/* <div className={styles.accountStat} ref={refs.setReference} {...getReferenceProps()}></div> */}
      {isOpen && (
        <div
          className={styles.dropdown}
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          <ul>
            <li onClick={handleClickEntry}>aa</li>
            <li onClick={handleClickEntry}>bb</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SetDropdown;

export interface SetDropdownProps {
  handleSelectVal?: any;
}
