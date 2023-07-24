"use client";

import React from "react";

import styles from "./Circuits.module.scss";
import Table, { TableColumns, TableData } from "@/components/table/Table";
import { i18nContext } from "@/contexts/i18n";
import Widget from "@/components/widget/Widget";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import { stateContext } from "@/contexts/state";
import useLocalWallet from "@/hooks/useLocalWallet";
import Card from "@/components/card/Card";
import CardRow from "@/components/card_row/CardRow";
import prfsBackend from "@/fetch/prfsBackend";

const Circuits: React.FC = () => {
  let i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);

  useLocalWallet(dispatch);

  let circuitTableColumns = React.useMemo(() => {
    let circuitTableColumns: TableColumns<CircuitTableKeys> = [
      {
        key: "id",
        elem: (
          <div key="id" className={styles.id}>
            {i18n.id}
          </div>
        ),
      },
      {
        key: "name",
        elem: (
          <div key="name" className={styles.name}>
            {i18n.name}
          </div>
        ),
      },
      {
        key: "author",
        elem: (
          <div key="author" className={styles.author}>
            {i18n.author}
          </div>
        ),
      },
      {
        key: "num_public_inputs",
        elem: (
          <div key="num_public_inputs" className={styles.numInputs}>
            {i18n.num_inputs}
          </div>
        ),
      },
      {
        key: "desc",
        elem: (
          <div key="desc" className={styles.desc}>
            {i18n.description}
          </div>
        ),
      },
      {
        key: "created_at",
        elem: (
          <div key="created_at" className={styles.createdAt}>
            {i18n.created_at}
          </div>
        ),
      },
    ];

    return circuitTableColumns;
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
        <div key={val.id} className={styles.tableRow}>
          <div key="id" className={styles.id}>
            {val.id}
          </div>
          <div key="name" className={styles.name}>
            {val.name}
          </div>
          <div key="author" className={styles.author}>
            {val.author}
          </div>
          <div key="num_public_inputs" className={styles.numInputs}>
            {val.num_public_inputs}
          </div>
          <div key="desc" className={styles.desc}>
            {val.desc}
          </div>
          <div key="created_at" className={styles.createdAt}>
            {val.created_at}
          </div>
        </div>
      );

      rows.push(row);
    }

    return <div key={page}>{rows}</div>;
  }, []);

  const handleChangeCircuitPage = React.useCallback(async (page: number) => {
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
    <DefaultLayout>
      <CardRow>
        <Card>
          <Widget label={i18n.circuits}>
            <div className={styles.wrapper}>
              <Table
                headerClassName={styles.tableHeader}
                columns={circuitTableColumns}
                createRows={createRows}
                onChangePage={handleChangeCircuitPage}
              />
            </div>
          </Widget>
        </Card>
      </CardRow>
    </DefaultLayout>
  );
};

export default Circuits;

type CircuitTableKeys = "id" | "name" | "author" | "num_public_inputs" | "desc" | "created_at";
