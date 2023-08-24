import React from "react";
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import styles from "./Table2.module.scss";

function Table2<T>({ data, columns }: Table2Props<T>) {
  // const [data, setData] = React.useState(() => [...defaultData]);
  const rerender = React.useReducer(() => ({}), {})[1];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={styles.wrapper}>
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
        {/* <tfoot> */}
        {/*   {table.getFooterGroups().map(footerGroup => ( */}
        {/*     <tr key={footerGroup.id}> */}
        {/*       {footerGroup.headers.map(header => ( */}
        {/*         <th key={header.id}> */}
        {/*           {header.isPlaceholder */}
        {/*             ? null */}
        {/*             : flexRender(header.column.columnDef.footer, header.getContext())} */}
        {/*         </th> */}
        {/*       ))} */}
        {/*     </tr> */}
        {/*   ))} */}
        {/* </tfoot> */}
      </table>
      <div className="h-4" />
      <button onClick={() => rerender()} className="border p-2">
        Rerender
      </button>
    </div>
  );
}

export default Table2;

export interface Table2Props<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
}
