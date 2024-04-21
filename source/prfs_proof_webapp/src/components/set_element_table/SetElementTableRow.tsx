import React from "react";
import cn from "classnames";
import { PrfsSetElement } from "@taigalabs/prfs-entities/bindings/PrfsSetElement";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import styles from "./SetElementTable.module.scss";
import { AppTableRow } from "@/components/app_table_components/AppTableComponents";
import {
  AppTableCell,
  AppTableCellInner,
} from "@/components/app_table_components/AppTableCellComponents";
import { paths } from "@/paths";

const SetElementTableRow: React.FC<RowProps> = ({ row, style, router }) => {
  const name = React.useMemo(() => {
    if (row.label.length > 12) {
      return row.label.substring(0, 12) + "...";
    } else {
      row.label;
    }
  }, [row.label]);

  const data = React.useMemo(() => {
    return JSON.stringify(row.data);
  }, [row.data]);

  const handleClick = React.useCallback(() => {
    router.push(`${paths.sets}/${row.set_id}/${row.label}`);
  }, [router, row]);

  return (
    <AppTableRow style={style} handleClick={handleClick}>
      <AppTableCell className={cn(styles.name)} alwaysRender>
        <span>{name}</span>
      </AppTableCell>
      <AppTableCell className={cn(styles.data)} w1024>
        <AppTableCellInner>{data}</AppTableCellInner>
      </AppTableCell>
      <AppTableCell className={cn(styles.ref)} w1280>
        {row.ref}
      </AppTableCell>
      <AppTableCell className={cn(styles.ref)} flexGrow />
    </AppTableRow>
  );
};

export default SetElementTableRow;

export interface RowProps {
  row: PrfsSetElement;
  style: React.CSSProperties;
  router: AppRouterInstance;
}
