import React from "react";

import styles from "./Dropdown.module.scss";

const DropdownEntry: React.FC<DropdownEntryProps> = ({ children }) => {
  return (
    <div className={styles.dropdownEntryWrapper} role="button">
      {children}
    </div>
  );
};

export default DropdownEntry;

export interface DropdownEntryProps {
  children: React.ReactNode;
}
