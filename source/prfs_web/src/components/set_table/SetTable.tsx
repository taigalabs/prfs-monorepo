"use client";

import React from "react";

import styles from "./CircuitTable.module.scss";
import { stateContext } from "@/contexts/state";
import Table, { TableData } from "@/components/table/Table";
import { i18nContext } from "@/contexts/i18n";
import prfsBackend from "@/fetch/prfsBackend";

const SetTable: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);

  const createHeader = React.useCallback((keys: ReadonlyArray<CircuitTableKeys>) => {
    return (
      <div className={styles.tableHeader}>
        <div key={keys[0]} className={styles.id}>
          {i18n.id}
        </div>
        <div key={keys[1]} className={styles.name}>
          {i18n.name}
        </div>
        <div key={keys[2]} className={styles.author}>
          {i18n.author}
        </div>
        <div key={keys[3]} className={styles.numInputs}>
          {i18n.num_inputs}
        </div>
        <div key={keys[4]} className={styles.desc}>
          {i18n.description}
        </div>
        <div key={keys[5]} className={styles.createdAt}>
          {i18n.created_at}
        </div>
      </div>
    );
  }, []);

  const createRows = React.useCallback((data: TableData<CircuitTableKeys>) => {
    // console.log(1, data);
    let { page, values } = data;

    let rows = [];
    if (values === undefined || values.length < 1) {
      return rows;
    }

    for (let val of values) {
      let row = (
        <div key={val.set_id} className={styles.tableRow}>
          <div key="set_id" className={styles.id}>
            {val.id}
          </div>
          {/* <div key={val.label} className={styles.name}> */}
          {/*   {val.name} */}
          {/* </div> */}
          {/* <div key="author" className={styles.author}> */}
          {/*   {val.author} */}
          {/* </div> */}
          {/* <div key="num_public_inputs" className={styles.numInputs}> */}
          {/*   {val.num_public_inputs} */}
          {/* </div> */}
          {/* <div key="desc" className={styles.desc}> */}
          {/*   {val.desc} */}
          {/* </div> */}
          {/* <div key="created_at" className={styles.createdAt}> */}
          {/*   {val.created_at} */}
          {/* </div> */}
        </div>
      );

      rows.push(row);
    }

    return <div key={page}>{rows}</div>;
  }, []);

  const handleChangePage = React.useCallback(async (page: number) => {
    return prfsBackend
      .getSets({
        page,
      })
      .then(resp => {
        const { page, sets } = resp.payload;
        return {
          page,
          values: sets,
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

type CircuitTableKeys = (typeof SET_TABLE_KEYS)[number];
