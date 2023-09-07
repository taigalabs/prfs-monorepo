import React from "react";
import { PrfsTreeNode } from "@taigalabs/prfs-entities/bindings/PrfsTreeNode";
import { CellContext } from "@tanstack/react-table";
import { BsPencil } from "@react-icons/all-files/bs/BsPencil";
import { BsCheck } from "@react-icons/all-files/bs/BsCheck";
import { ImCancelCircle } from "@react-icons/all-files/im/ImCancelCircle";

import styles from "./SetElementTable.module.scss";

export const EditableCell = ({ getValue, row, column, table }: CellContext<PrfsTreeNode, any>) => {
  const initialValue = getValue();

  const [value, setValue] = React.useState(initialValue);
  const [isEdit, setIsEdit] = React.useState(false);

  const handleClickSave = React.useCallback(async () => {
    const meta = table.options.meta as any;
    meta?.updateData(row.index, column.id, value);
    setIsEdit(false);
  }, [table, setIsEdit, value]);

  const handleClickCancel = React.useCallback(() => {
    setValue(initialValue);
    setIsEdit(false);
  }, [table, initialValue]);

  const handleClickEdit = React.useCallback(() => {
    setIsEdit(true);
  }, [setIsEdit]);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <div className={styles.editableCell}>
      {isEdit ? (
        <div className={styles.editMode}>
          <input value={value as string} onChange={e => setValue(e.target.value)} />
          <button onClick={handleClickSave}>
            <BsCheck />
          </button>
          <button onClick={handleClickCancel}>
            <ImCancelCircle />
          </button>
        </div>
      ) : (
        <div className={styles.normalMode}>
          <p>{value}</p>
          <button onClick={handleClickEdit}>
            <BsPencil />
          </button>
        </div>
      )}
    </div>
  );
};
