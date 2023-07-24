"use client";

import React from "react";

import styles from "./Circuits.module.scss";
import Table, { TableColumns, TableValues } from "@/components/table/Table";
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
    let circuitTableColumns: TableColumns<CircuitTableValues> = {
      name: {
        label: i18n.name,
        elem: <div className={styles.nameCol}>{i18n.name}</div>,
      },
      author: {
        label: i18n.author,
        elem: <div className={styles.authorCol}>{i18n.author}</div>,
      },
      num_public_inputs: {
        label: i18n.num_inputs,
        elem: <div className={styles.num_public_inputs}>{i18n.num_inputs}</div>,
      },
      desc: {
        label: i18n.description,
        elem: <div className={styles.desc}>{i18n.description}</div>,
      },
      created_at: {
        label: i18n.created_at,
        elem: <div className={styles.created_at}>{i18n.created_at}</div>,
      },
    };

    return circuitTableColumns;
  }, []);

  const createRows = React.useCallback(
    (columns: TableColumns<CircuitTableValues>, values: TableValues<CircuitTableValues>) => {
      // console.log(1, values, columns);

      let rows = [];

      if (values === undefined || values.length < 1) {
        return rows;
      }

      for (let val of values) {
        let row = (
          <div className={styles.tableRow}>
            <div key={columns.name.label} className={styles.cell}>
              {val.name}
            </div>
            <div key={columns.author.label} className={styles.cell}>
              {val.author}
            </div>
            <div key={columns.num_public_inputs.label} className={styles.cell}>
              {val.num_public_inputs}
            </div>
            <div key={columns.desc.label} className={styles.cell}>
              {val.desc}
            </div>
            <div key={columns.created_at.label} className={styles.cell}>
              {val.created_at}
            </div>
          </div>
        );

        rows.push(<div className={styles.tableRow}>{row}</div>);
      }

      return <div>{rows}</div>;
    },
    []
  );

  const handleChangeCircuitPage = React.useCallback(async (page: number) => {
    return prfsBackend
      .getNativeCircuits({
        page,
      })
      .then(resp => resp.payload.circuits);
  }, []);

  return (
    <DefaultLayout>
      <CardRow>
        <Card>
          <Widget label={i18n.circuits}>
            <Table
              columns={circuitTableColumns}
              createRows={createRows}
              onChangePage={handleChangeCircuitPage}
            />
          </Widget>
        </Card>
      </CardRow>
    </DefaultLayout>
  );
};

export default Circuits;

interface CircuitTableValues {
  name: any;
  author: any;
  num_public_inputs: any;
  desc: any;
  created_at: any;
}
