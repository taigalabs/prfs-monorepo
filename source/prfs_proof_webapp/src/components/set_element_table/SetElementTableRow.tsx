import React from "react";
import cn from "classnames";
import { PrfsSetElement } from "@taigalabs/prfs-entities/bindings/PrfsSetElement";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import styles from "./SetElementTableRow.module.scss";
import { AppTableRow } from "@/components/app_table_components/AppTableComponents";
import { AppTableHeader } from "@/components/app_table_components/AppTableComponents";
import {
  AppTableCell,
  AppTableHeaderCell,
  AppTableCellInner,
} from "@/components/app_table_components/AppTableCellComponents";
import { paths } from "@/paths";
import { useI18N } from "@/i18n/use_i18n";

export const SetElementTableHeaderRow: React.FC<{}> = ({}) => {
  const i18n = useI18N();

  return (
    <AppTableHeader>
      <AppTableHeaderCell className={cn(styles.name)} alwaysRender>
        {i18n.name}
      </AppTableHeaderCell>
      <AppTableHeaderCell className={cn(styles.data)} w1024>
        {i18n.data}
      </AppTableHeaderCell>
      <AppTableHeaderCell className={cn(styles.ref)} w1280>
        {i18n.ref}
      </AppTableHeaderCell>
      <AppTableHeaderCell className={cn(styles.ref)} flexGrow />
    </AppTableHeader>
  );
};

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
