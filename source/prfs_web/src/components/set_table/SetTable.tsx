"use client";

import React from "react";
import Link from "next/link";

import styles from "./SetTable.module.scss";
import Table, { TableBody, TableRow, TableHeader, TableData } from "@/components/table/Table";
import { i18nContext } from "@/contexts/i18n";
import * as prfsBackend from "@/fetch/prfsBackend";
import { PrfsSet } from "@/models";

const SetTable: React.FC<SetTableProps> = ({ selectType, selectedVal, handleSelectVal }) => {
  const i18n = React.useContext(i18nContext);

  const createHeader = React.useCallback(() => {
    return (
      <TableHeader>
        <TableRow>
          {handleSelectVal && <th className={styles.select}></th>}
          <th className={styles.set_id}>{i18n.set_id}</th>
          <th className={styles.label}>{i18n.label}</th>
          <th className={styles.author}>{i18n.author}</th>
          <th className={styles.desc}>{i18n.description}</th>
          <th className={styles.cardinality}>{i18n.cardinality}</th>
          <th className={styles.createdAt}>{i18n.created_at}</th>
        </TableRow>
      </TableHeader>
    );
  }, [handleSelectVal]);

  const createBody = React.useCallback(({ data, handleSelectVal, selectedVal }) => {
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
            <td className={styles.select}>
              <div>
                <input type={selType} checked={isSelected} readOnly />
              </div>
            </td>
          )}
          <td className={styles.set_id}>
            <Link href={`/sets/${val.set_id}`}>{val.set_id}</Link>
          </td>
          <td className={styles.label}>{val.label}</td>
          <td className={styles.author}>{val.author}</td>
          <td className={styles.desc}>{val.desc}</td>
          <td className={styles.cardinality}>{val.cardinality}</td>
          <td className={styles.createdAt}>{val.created_at}</td>
        </TableRow>
      );

      rows.push(row);
    }

    return <TableBody>{rows}</TableBody>;
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
  selectedVal?: PrfsSet;
  handleSelectVal?: (row: PrfsSet) => void;
}
