import React from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { useFloating, useClick, useInteractions, useDismiss } from "@floating-ui/react";

import styles from "./Dropdown.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { RecordOfKeys } from "@/models/types";

function Dropdown<T extends string>({ createBase, createList, handleSelectVal }: DropdownProps<T>) {
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

  const upgradedHandleSelectVal = React.useCallback(() => {}, [handleSelectVal]);

  let baseElem = React.useMemo(() => {
    return createBase();
  }, []);

  let listElem = React.useMemo(() => {
    return createList({
      upgradedHandleSelectVal,
    });
  }, []);

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
        </div>
      )}
    </div>
  );
}

export default Dropdown;

export interface DropdownProps<T extends string> {
  createBase: () => React.ReactNode;
  createList: (args: CreateListArgs<T>) => React.ReactNode;
  handleSelectVal: (data: RecordOfKeys<T>) => void;
}

interface CreateListArgs<T extends string> {
  upgradedHandleSelectVal: (val: RecordOfKeys<T>) => void;
}

export type DropdownSingleSelectedValue<T extends string> = RecordOfKeys<T>;

export interface DropdownMultiSelectedValue<T extends string> {
  [id: string]: RecordOfKeys<T>;
}

export type DropdownData<T extends string> = {
  page: number;
  values: RecordOfKeys<T>[];
};
