"use client";

import React, { MouseEventHandler } from "react";
import Link from "next/link";

import styles from "./CircuitTable.module.scss";
import Table, {
  TableBody,
  TableRow,
  TableHeader,
  TableKeys,
  CreateBodyArgs,
  TableRowValue,
  TableSelectedValue,
} from "@/components/table/Table";
import { i18nContext } from "@/contexts/i18n";
import prfsBackend from "@/fetch/prfsBackend";

const CircuitTable: React.FC<CircuitTableProps> = ({ selectType, selectedVal, setSelectedVal }) => {
  const i18n = React.useContext(i18nContext);

  // const [selectedVal, setSelectedVal] = React.useState<TableSelectedValue<CircuitTableKeys>>({});

  const createHeader = React.useCallback(
    (keys: TableKeys<CircuitTableKeys>) => {
      return (
        <TableHeader>
          <TableRow>
            {setSelectedVal && <th key="select" className={styles.radio}></th>}
            <th key={keys.circuit_id} className={styles.circuit_id}>
              {i18n.circuit_id}
            </th>
            <th key={keys.label} className={styles.label}>
              {i18n.label}
            </th>
            <th key={keys.desc} className={styles.desc}>
              {i18n.description}
            </th>
            <th key={keys.author} className={styles.author}>
              {i18n.author}
            </th>
            <th key={keys.created_at} className={styles.createdAt}>
              {i18n.created_at}
            </th>
          </TableRow>
        </TableHeader>
      );
    },
    [setSelectedVal]
  );

  const createBody = React.useCallback(
    ({ keys, data, onClickRow, selectedVal }: CreateBodyArgs<CircuitTableKeys>) => {
      let { page, values } = data;

      let rows = [];
      if (values === undefined || values.length < 1) {
        return rows;
      }

      // console.log(22, selectedVal);

      for (let val of values) {
        const handleClickRow: MouseEventHandler = _ev => {
          onClickRow(val);
        };

        const isSelected = selectedVal && !!selectedVal[val.circuit_id];
        const selType = selectType || "radio";

        let row = (
          <TableRow key={val.circuit_id} onClickRow={handleClickRow}>
            {selectedVal && (
              <td key="select" className={styles.radio}>
                <input type={selType} checked={isSelected} readOnly />
              </td>
            )}
            <td key={keys.circuit_id} className={styles.circuit_id}>
              <Link href={`/circuits/${val.circuit_id}`}>{val.circuit_id}</Link>
            </td>
            <td key={keys.label} className={styles.label}>
              {val.label}
            </td>
            <td key={keys.desc} className={styles.desc}>
              {val.desc}
            </td>
            <td key={keys.author} className={styles.author}>
              {val.author}
            </td>
            <td key={keys.created_at} className={styles.createdAt}>
              {val.created_at}
            </td>
          </TableRow>
        );

        rows.push(row);
      }

      return <TableBody key={page}>{rows}</TableBody>;
    },
    [setSelectedVal]
  );

  const handleChangeProofPage = React.useCallback(async (page: number) => {
    return prfsBackend
      .getPrfsNativeCircuits({
        page,
      })
      .then(resp => {
        const { page, prfs_circuits } = resp.payload;
        return {
          page,
          values: prfs_circuits,
        };
      });
  }, []);

  const handleClickRow = React.useCallback(
    (val: TableRowValue<CircuitTableKeys>) => {
      if (setSelectedVal) {
        console.log(11, val);

        setSelectedVal(oldVal => {
          if (oldVal[val.circuit_id]) {
            const newVal = { ...oldVal };
            delete newVal[val.circuit_id];
            return newVal;
          } else {
            return {
              ...oldVal,
              [val.circuit_id]: val,
            };
          }
        });
      }
    },
    [setSelectedVal]
  );

  return (
    <Table
      keys={CIRCUIT_TABLE_KEYS}
      createHeader={createHeader}
      createBody={createBody}
      onChangePage={handleChangeProofPage}
      minWidth={880}
      selectedVal={selectedVal}
      onClickRow={handleClickRow}
    />
  );
};

export default CircuitTable;

export interface CircuitTableProps {
  selectType?: "checkbox" | "radio";
  selectedVal?: TableSelectedValue<CircuitTableKeys>;
  setSelectedVal?: React.Dispatch<React.SetStateAction<TableSelectedValue<CircuitTableKeys>>>;
}

const CIRCUIT_TABLE_KEYS = [
  "circuit_id",
  "label",
  "author",
  "num_public_inputs",
  "desc",
  "created_at",
] as const;

export type CircuitTableKeys = (typeof CIRCUIT_TABLE_KEYS)[number];
