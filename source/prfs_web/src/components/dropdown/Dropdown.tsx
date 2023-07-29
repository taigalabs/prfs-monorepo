import React from "react";
import Link from "next/link";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { useRouter } from "next/navigation";
import { useFloating, useClick, useInteractions, useDismiss } from "@floating-ui/react";

import styles from "./Dropdown.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { RecordOfKeys } from "@/models/types";

const Dropdown: React.FC<DropdownProps> = ({ baseElem, listElem }) => {
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

  // const handleClickSignOut = React.useCallback(() => {
  //   console.log("123");
  // }, []);

  // let baseElem = React.useMemo(() => {
  //   return createBase();
  // }, [createBase]);

  // let listElem = React.useMemo(() => {
  //   return createList();
  // }, [createList]);

  return (
    <div className={styles.dropdownWrapper}>
      <div className={styles.dropdownBase} ref={refs.setReference} {...getReferenceProps()}>
        <div>{baseElem}</div>
        <div className={styles.arrowContainer}>
          {isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        </div>
      </div>
      {isOpen && (
        <div
          className={styles.dropdown}
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          {listElem}
          {/* <ul> */}
          {/*   <li onClick={handleClickEntry}>aa</li> */}
          {/*   <li onClick={handleClickEntry}>bb</li> */}
          {/* </ul> */}
        </div>
      )}
    </div>
  );
};

export default Dropdown;

export interface DropdownProps {
  baseElem: React.ReactNode;
  listElem: React.ReactNode;
}

export interface DropdownSelectedValue<T extends string> {
  [id: string]: RecordOfKeys<T>;
}

export type DropdownData<T extends string> = {
  page: number;
  values: RecordOfKeys<T>[];
};
