"use client";

import React from "react";
import Link from "next/link";

import styles from "./SetTable.module.scss";
import Table, { TableData, TableKeys } from "@/components/table/Table";
import { i18nContext } from "@/contexts/i18n";
import prfsBackend from "@/fetch/prfsBackend";

const SetTable: React.FC = () => {
  const i18n = React.useContext(i18nContext);

  const createHeader = React.useCallback((keys: TableKeys<SetTableKeys>) => {
    return (
      <div className={styles.tableHeader}>
        <div key={keys[0]} className={styles.set_id}>
          {i18n.set_id}
        </div>
        <div key={keys[1]} className={styles.label}>
          {i18n.label}
        </div>
        <div key={keys[2]} className={styles.author}>
          {i18n.author}
        </div>
        <div key={keys[3]} className={styles.desc}>
          {i18n.description}
        </div>
        <div key={keys[4]} className={styles.cardinality}>
          {i18n.cardinality}
        </div>
        <div key={keys[5]} className={styles.createdAt}>
          {i18n.created_at}
        </div>
      </div>
    );
  }, []);

  const createRows = React.useCallback(
    (keys: TableKeys<SetTableKeys>, data: TableData<SetTableKeys>) => {
      // console.log(1, data);
      let { page, values } = data;

      let rows = [];
      if (values === undefined || values.length < 1) {
        return rows;
      }

      for (let val of values) {
        let row = (
          <div key={val.set_id} className={styles.tableRow}>
            <div key={keys.set_id} className={styles.set_id}>
              <Link href={`/sets/${val.set_id}`}>{val.set_id}</Link>
            </div>
            <div key={keys.label} className={styles.label}>
              {val.label}
            </div>
            <div key={keys.author} className={styles.author}>
              {val.author}
            </div>
            <div key={keys.desc} className={styles.desc}>
              {val.desc}
            </div>
            <div key={keys.cardinality} className={styles.cardinality}>
              {val.cardinality}
            </div>
            <div key={keys.created_at} className={styles.createdAt}>
              {val.created_at}
            </div>
          </div>
        );

        rows.push(row);
      }

      return <div key={page}>{rows}</div>;
    },
    []
  );

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
      keys={SET_TABLE_KEYS}
      createHeader={createHeader}
      createRows={createRows}
      onChangePage={handleChangePage}
    />
  );
};

export default SetTable;

const SET_TABLE_KEYS = [
  "set_id",
  "label",
  "author",
  "desc",
  "hash_algorithm",
  "cardinality",
  "created_at",
] as const;

type SetTableKeys = (typeof SET_TABLE_KEYS)[number];
