import React from "react";

import styles from "./Form.module.scss";

export const FormSelectedItemsEntry: React.FC<FormSelectedItemsEntryProps> = ({ children }) => {
  return <div>{children}</div>;
};

const FormSelectedItems: React.FC<FormSelectedItemsProps> = ({ children, label }) => {
  return (
    <div>
      <div>{label}</div>
      {children}
    </div>
  );
};

export default FormSelectedItems;

export interface FormSelectedItemsProps {
  children: React.ReactNode;
  label: string;
}

export interface FormSelectedItemsEntryProps {
  children: React.ReactNode;
}
