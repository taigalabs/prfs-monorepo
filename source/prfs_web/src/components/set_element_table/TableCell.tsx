import { PrfsTreeNode } from "@taigalabs/prfs-entities/bindings/PrfsTreeNode";
import { CellContext } from "@tanstack/react-table";
import { useState, useEffect, ChangeEvent } from "react";

type Option = {
  label: string;
  value: string;
};

export const TableCell = ({ getValue, row, column, table }: CellContext<PrfsTreeNode, any>) => {
  const initialValue = getValue();
  const columnMeta = column.columnDef.meta as any;
  const tableMeta = table.options.meta as any;
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    console.log(44, row.index);

    setValue(initialValue);
  }, [initialValue]);

  const onBlur = () => {
    tableMeta?.updateData(row.index, column.id, value);
  };

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value);
    tableMeta?.updateData(row.index, column.id, e.target.value);
  };

  if (tableMeta?.editedRows[row.id]) {
    return columnMeta?.type === "select" ? (
      <select onChange={onSelectChange} value={initialValue}>
        {columnMeta?.options?.map((option: Option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ) : (
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        onBlur={onBlur}
        type={columnMeta?.type || "text"}
      />
    );
  }

  return <span>{value}</span>;
};
