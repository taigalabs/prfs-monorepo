import React from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { useFloating, useClick, useInteractions, useDismiss } from "@floating-ui/react";

import styles from "./Dropdown.module.scss";

function Dropdown<T>({ createBase, createList, handleSelectVal }: DropdownProps<T>) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { refs, floatingStyles, context } = useFloating({
    placement: "bottom-end",
    open: isOpen,
    onOpenChange: setIsOpen,
  });
  const dismiss = useDismiss(context);
  const click = useClick(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

  const upgradedHandleSelectVal = React.useCallback(
    (data: T) => {
      handleSelectVal(data);
      setIsOpen(false);
    },
    [handleSelectVal, setIsOpen]
  );

  let baseElem = React.useMemo(() => {
    return createBase();
  }, [createBase]);

  let listElem = React.useMemo(() => {
    return createList({
      upgradedHandleSelectVal,
    });
  }, [createList]);

  return (
    <div className={styles.dropdownWrapper}>
      <div className={styles.dropdownBase} ref={refs.setReference} {...getReferenceProps()}>
        <div className={styles.baseContainer}>{baseElem}</div>
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

export interface DropdownProps<T> {
  createBase: () => React.ReactNode;
  createList: (args: CreateDropdownListArgs<T>) => React.ReactNode;
  handleSelectVal: (data: T) => void;
}

export interface CreateDropdownListArgs<T> {
  upgradedHandleSelectVal: (val: T) => void;
}

export type DropdownSingleSelectedValue<T> = T;

// export interface DropdownMultiSelectedValue<T extends string> {
//   [id: string]: RecordOfKeys<T>;
// }

export type DropdownData<T> = {
  page: number;
  values: T[];
};
