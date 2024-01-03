import React from "react";
import { IoMdArrowDropup } from "@react-icons/all-files/io/IoMdArrowDropup";
import { IoMdArrowDropdown } from "@react-icons/all-files/io/IoMdArrowDropdown";
import { flip, useFloating, useClick, useInteractions, useDismiss } from "@floating-ui/react";

import styles from "./Dropdown.module.scss";

function Dropdown<T>({ createBase, createList, handleSelectVal }: DropdownProps<T>) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { refs, floatingStyles, context } = useFloating({
    placement: "bottom-end",
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [flip()],
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
      <div
        className={styles.dropdownBase}
        ref={refs.setReference}
        {...getReferenceProps()}
        role="button"
      >
        <div className={styles.baseContainer}>{baseElem}</div>
        <div className={styles.arrowContainer}>
          {isOpen ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
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

export type DropdownData<T> = {
  page_idx: number;
  values: T[];
};
