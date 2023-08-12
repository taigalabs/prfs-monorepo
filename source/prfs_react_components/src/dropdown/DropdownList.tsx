import React from "react";

import styles from "./Dropdown.module.scss";

const DropdownList: React.FC<DropdownListProps> = ({ children }) => {
  return <div className={styles.dropdownListWrapper}>{children}</div>;
};

export default DropdownList;

export interface DropdownListProps {
  children: React.ReactNode;
}
