import React, { MouseEventHandler } from "react";
import classNames from "classnames";

import styles from "./Table.module.scss";

export const TableCurrentPageLimitWarning: React.FC = () => {
  return <div className={styles.pageLimitWarning}>Currently showing up to 20 elements</div>;
};

export const TableHeader: React.FC<TableHeaderProps> = ({ children }) => {
  return <thead className={styles.tableHeaderWrapper}>{children}</thead>;
};

export const TableBody: React.FC<TableBodyProps> = ({ children }) => {
  return <tbody className={styles.tableBodyWrapper}>{children}</tbody>;
};

export const TableCell: React.FC<TableCellProps> = ({ children }) => {
  return <td className={styles.tableCell}>{children}</td>;
};

export function TableRow({ isSelected, children, onClickRow }: TableRowProps) {
  return (
    <tr
      className={classNames({
        [styles.tableRowWrapper]: true,
        [styles.selectedRow]: !!isSelected,
      })}
      {...(onClickRow && { onClick: onClickRow })}
    >
      {children}
    </tr>
  );
}

function Table<T>({
  // createHeader,
  // createBody,
  // onChangePage,
  // handleSelectVal,
  minWidth,
  // selectedVal,
  // initialValues,
  children,
}: TableProps<T>) {
  // const [data, setValues] = React.useState({ page: 0, values: initialValues ? initialValues : [] });

  // React.useEffect(() => {
  //   if (onChangePage) {
  //     Promise.resolve(onChangePage(0)).then(res => {
  //       setValues(res);
  //     });
  //   }
  // }, [onChangePage, setValues]);

  // let headerElems = React.useMemo(() => {
  //   return createHeader();
  // }, []);

  // let bodyElems = React.useMemo(() => {
  //   return createBody({
  //     data,
  //     handleSelectVal,
  //     selectedVal,
  //   });
  // }, [data, selectedVal, handleSelectVal]);

  return (
    <div className={styles.tableWrapper}>
      <table
        className={styles.table}
        style={{
          minWidth,
        }}
      >
        {children}
      </table>
    </div>
  );
}

export default Table;

export interface TableProps<T> {
  children: React.ReactNode;
  createHeader?: () => React.ReactNode;
  createBody?: (args: CreateBodyArgs<T>) => React.ReactNode;
  onChangePage?: (page: number) => Promise<TableData<T>> | TableData<T>;
  initialValues?: T[];
  selectedVal?: T;
  handleSelectVal?: (row: T) => void;
  minWidth: number;
}

export type CreateBodyArgs<T> = {
  data: TableData<T>;
  selectedVal: T;
  handleSelectVal?: (row: T) => void;
};

export type TableData<T> = {
  page: number;
  values: T[];
};

export interface TableHeaderProps {
  children: React.ReactNode;
}

export interface TableBodyProps {
  children: React.ReactNode;
}

export interface TableCellProps {
  children: React.ReactNode;
}

export interface TableRowProps {
  isSelected?: boolean;
  children: React.ReactNode;
  onClickRow?: MouseEventHandler;
}
