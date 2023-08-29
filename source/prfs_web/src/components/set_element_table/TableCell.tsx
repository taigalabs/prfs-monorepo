import React from "react";
import { PrfsTreeNode } from "@taigalabs/prfs-entities/bindings/PrfsTreeNode";
import { CellContext } from "@tanstack/react-table";
import { useState, useEffect, ChangeEvent } from "react";
import { BsPencil } from "@react-icons/all-files/bs/BsPencil";
import { BsCheck } from "@react-icons/all-files/bs/BsCheck";

import styles from "./SetElementTable.module.scss";

export const EditableCell = ({ getValue, row, column, table }: CellContext<PrfsTreeNode, any>) => {
  const initialValue = getValue();

  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);
  const [isEdit, setIsEdit] = React.useState(false);

  // When the input is blurred, we'll call our table meta's updateData function
  const handleClickSave = React.useCallback(() => {
    const meta = table.options.meta as any;
    meta?.updateData(row.index, column.id, value);
    setIsEdit(false);
  }, [table, setIsEdit]);

  const handleClickEdit = React.useCallback(() => {
    setIsEdit(true);
  }, [setIsEdit]);

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <div className={styles.editableCell}>
      {isEdit ? (
        <>
          <input value={value as string} onChange={e => setValue(e.target.value)} />
          <button onClick={handleClickSave}>
            <BsCheck />
          </button>
        </>
      ) : (
        <>
          <p>{value}</p>
          <button onClick={handleClickEdit}>
            <BsPencil />
          </button>
        </>
      )}
    </div>
  );
};
