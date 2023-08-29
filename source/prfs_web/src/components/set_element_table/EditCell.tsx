import { PrfsTreeNode } from "@taigalabs/prfs-entities/bindings/PrfsTreeNode";
import React from "react";
import { CellContext } from "@tanstack/react-table";

export const EditCell = ({ row, table }: CellContext<PrfsTreeNode, any>) => {
  const meta = table.options.meta as any;

  const setEditedRows = (e: React.MouseEvent<HTMLButtonElement>) => {
    const elName = e.currentTarget.name;

    meta?.setEditedRows((old: any) => ({
      ...old,
      [row.id]: !old[row.id],
    }));

    if (elName !== "edit") {
      meta?.revertData(row.index, e.currentTarget.name === "cancel");
    }
  };

  const removeRow = () => {
    meta?.removeRow(row.index);
  };

  return (
    <div className="edit-cell-container">
      {meta?.editedRows[row.id] ? (
        <div className="edit-cell-action">
          <button onClick={setEditedRows} name="cancel">
            ⚊
          </button>{" "}
          <button onClick={setEditedRows} name="done">
            ✔
          </button>
        </div>
      ) : (
        <div className="edit-cell-action">
          <button onClick={setEditedRows} name="edit">
            ✐
          </button>
          <button onClick={removeRow} name="remove">
            X
          </button>
        </div>
      )}
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    </div>
  );
};
