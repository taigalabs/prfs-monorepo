"use client";

import React from "react";
import Link from "next/link";

import styles from "./SetTable.module.scss";
import Table, {
  TableBody,
  TableRow,
  TableHeader,
  TableData,
  TableSelectedValue,
} from "@/components/table/Table";
import { i18nContext } from "@/contexts/i18n";
import * as prfsBackend from "@/fetch/prfsBackend";
import { KeysAsObject, RecordOfKeys } from "@/models/types";
import { PRFS_SET_KEYS, PrfsSetKeys } from "@/models";

const SetTable: React.FC<SetTableProps> = ({ selectType, selectedVal, handleSelectVal }) => {
  const i18n = React.useContext(i18nContext);

  const createHeader = React.useCallback(
    (keys: KeysAsObject<PrfsSetKeys>) => {
      return (
        <TableHeader>
          <TableRow>
            {handleSelectVal && <th key="select" className={styles.select}></th>}
            <th key={keys[0]} className={styles.set_id}>
              {i18n.set_id}
            </th>
            <th key={keys[1]} className={styles.label}>
              {i18n.label}
            </th>
            <th key={keys[2]} className={styles.author}>
              {i18n.author}
            </th>
            <th key={keys[3]} className={styles.desc}>
              {i18n.description}
            </th>
            <th key={keys[4]} className={styles.cardinality}>
              {i18n.cardinality}
            </th>
            <th key={keys[5]} className={styles.createdAt}>
              {i18n.created_at}
            </th>
          </TableRow>
        </TableHeader>
      );
    },
    [handleSelectVal]
  );

  const createBody = React.useCallback(({ keys, data, handleSelectVal, selectedVal }) => {
    // console.log(1, data);
    let { page, values } = data;

    let rows = [];
    if (values === undefined || values.length < 1) {
      return rows;
    }

    for (let val of values) {
      const onClickRow = handleSelectVal
        ? () => {
            handleSelectVal(val);
          }
        : undefined;

      const isSelected = selectedVal && !!selectedVal[val.set_id];
      const selType = selectType || "radio";

      let row = (
        <TableRow key={val.set_id} onClickRow={onClickRow} isSelected={isSelected}>
          {handleSelectVal && (
            <td key="select" className={styles.select}>
              <div>
                <input type={selType} checked={isSelected} readOnly />
              </div>
            </td>
          )}
          <td key={keys.set_id} className={styles.set_id}>
            <Link href={`/sets/${val.set_id}`}>{val.set_id}</Link>
          </td>
          <td key={keys.label} className={styles.label}>
            {val.label}
          </td>
          <td key={keys.author} className={styles.author}>
            {val.author}
          </td>
          <td key={keys.desc} className={styles.desc}>
            {val.desc}
          </td>
          <td key={keys.cardinality} className={styles.cardinality}>
            {val.cardinality}
          </td>
          <td key={keys.created_at} className={styles.createdAt}>
            {val.created_at}
          </td>
        </TableRow>
      );

      rows.push(row);
    }

    return <TableBody key={page}>{rows}</TableBody>;
  }, []);

  const handleChangePage = React.useCallback(async (page: number) => {
    return prfsBackend
      .getSets({
        page,
      })
      .then(resp => {
        const { page, prfs_sets } = resp.payload;
        return {
          page,
          values: prfs_sets,
        };
      });
  }, []);

  return (
    <Table
      keys={PRFS_SET_KEYS}
      createHeader={createHeader}
      createBody={createBody}
      onChangePage={handleChangePage}
      minWidth={910}
      selectedVal={selectedVal}
      handleSelectVal={handleSelectVal}
    />
  );
};

export default SetTable;

export interface SetTableProps {
  selectType?: "checkbox" | "radio";
  selectedVal?: TableSelectedValue<PrfsSetKeys>;
  handleSelectVal?: (row: RecordOfKeys<PrfsSetKeys>) => void;
}
