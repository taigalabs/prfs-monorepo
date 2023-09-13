import React from "react";
import { Cell, flexRender, Row } from "@tanstack/react-table";
import { PrfsProofInstanceSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofInstanceSyn1";

import styles from "./RowItem.module.scss";
import { i18nContext } from "@/contexts/i18n";

const RowItem: React.FC<EntryProps> = ({ row }) => {
  const cells = row.getVisibleCells();
  const [imgUrlCell, proofLabelCell, createdAtCell, prioritizedValuesCell] = cells;

  const imgUrl = renderCell(imgUrlCell);
  const proofLabel = renderCell(proofLabelCell);
  const createdAt = renderCell(createdAtCell);
  const prioritizedValues = renderCell(prioritizedValuesCell);

  return (
    <div className={styles.wrapper}>
      <div className={styles.leftCol}>{imgUrl}</div>
      <div className={styles.rightCol}>
        <div className={styles.header}>
          <span className={styles.label}>{proofLabel}</span>
          <span>{"·"}</span>
          <span className={styles.createdAt}>{createdAt}</span>
        </div>
        <div className={styles.prioritizedValues}>{prioritizedValues}</div>
      </div>
    </div>
  );
};

export default RowItem;

export interface EntryProps {
  row: Row<PrfsProofInstanceSyn1>;
}

function renderCell(cell: Cell<PrfsProofInstanceSyn1, unknown>) {
  return flexRender(cell.column.columnDef.cell, cell.getContext());
}
