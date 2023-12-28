import React from "react";
import { Cell, flexRender, Row } from "@tanstack/react-table";
import { PrfsProofInstanceSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofInstanceSyn1";
import { useRouter } from "next/navigation";

import styles from "./RowItem.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import { PrfsPoll } from "@taigalabs/prfs-entities/bindings/PrfsPoll";

const RowItem: React.FC<EntryProps> = ({ row }) => {
  const router = useRouter();
  const cells = row.getVisibleCells();
  const [labelCell, createdAtCell, descCell, pollIdCell] = cells;

  const label = renderCell(labelCell);
  const desc = renderCell(descCell);
  const createdAt = renderCell(createdAtCell);
  const pollId = pollIdCell.getValue();

  const handleClickRow = React.useCallback(() => {
    router.push(`${paths.polls}/${pollId}`);
  }, [router, pollId]);

  return (
    <div className={styles.wrapper} onClick={handleClickRow}>
      <div className={styles.rightCol}>
        <div className={styles.header}>
          <p className={styles.label}>{label}</p>
          <p className={styles.desc}>{desc}</p>
          <span className={styles.createdAt}>{createdAt}</span>
        </div>
      </div>
    </div>
  );
};

export default RowItem;

export interface EntryProps {
  row: Row<PrfsPoll>;
}

function renderCell(cell: Cell<PrfsPoll, unknown>) {
  return flexRender(cell.column.columnDef.cell, cell.getContext());
}
