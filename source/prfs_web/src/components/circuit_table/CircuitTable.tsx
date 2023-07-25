"use client";

import React from "react";

import styles from "./CircuitTable.module.scss";
import Table, { TableData, TableKeys } from "@/components/table/Table";
import { i18nContext } from "@/contexts/i18n";
import prfsBackend from "@/fetch/prfsBackend";

const CircuitTable: React.FC = () => {
  const i18n = React.useContext(i18nContext);

  const createHeader = React.useCallback((keys: TableKeys<CircuitTableKeys>) => {
    return (
      <div className={styles.tableHeader}>
        <div key={keys.id} className={styles.id}>
          {i18n.id}
        </div>
        <div key={keys.label} className={styles.label}>
          {i18n.label}
        </div>
        <div key={keys.author} className={styles.author}>
          {i18n.author}
        </div>
        <div key={keys.num_public_inputs} className={styles.numInputs}>
          {i18n.num_inputs}
        </div>
        <div key={keys.desc} className={styles.desc}>
          {i18n.description}
        </div>
        <div key={keys.created_at} className={styles.createdAt}>
          {i18n.created_at}
        </div>
      </div>
    );
  }, []);

  const createRows = React.useCallback(
    (keys: TableKeys<CircuitTableKeys>, data: TableData<CircuitTableKeys>) => {
      // console.log(1, data);
      let { page, values } = data;

      let rows = [];
      if (values === undefined || values.length < 1) {
        return rows;
      }

      for (let val of values) {
        let row = (
          <div key={val.id} className={styles.tableRow}>
            <div key={keys.id} className={styles.id}>
              {val.id}
            </div>
            <div key={keys.label} className={styles.label}>
              {val.label}
            </div>
            <div key={keys.author} className={styles.author}>
              {val.author}
            </div>
            <div key={keys.num_public_inputs} className={styles.numInputs}>
              {val.num_public_inputs}
            </div>
            <div key={keys.desc} className={styles.desc}>
              {val.desc}
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

  const handleChangeProofPage = React.useCallback(async (page: number) => {
    return prfsBackend
      .getNativeCircuits({
        page,
      })
      .then(resp => {
        const { page, circuits } = resp.payload;
        return {
          page,
          values: circuits,
        };
      });
  }, []);

  return (
    <Table
      keys={CIRCUIT_TABLE_KEYS}
      createHeader={createHeader}
      createRows={createRows}
      onChangePage={handleChangeProofPage}
    />
  );
};

export default CircuitTable;

const CIRCUIT_TABLE_KEYS = [
  "id",
  "label",
  "author",
  "num_public_inputs",
  "desc",
  "created_at",
] as const;

type CircuitTableKeys = (typeof CIRCUIT_TABLE_KEYS)[number];
