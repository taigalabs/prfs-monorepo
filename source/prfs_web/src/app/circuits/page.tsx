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
import { Circuit } from "@/models";

const Circuits: React.FC = () => {
  let i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);

  useLocalWallet(dispatch);

  let circuitTableColumns = React.useMemo(() => {
    let circuitTableColumns: TableColumns<CircuitTableValues> = {
      name: {
        label: i18n.name,
        width: 180,
      },
      author: {
        label: i18n.author,
        width: 160,
      },
      num_public_inputs: {
        label: i18n.num_inputs,
        width: 100,
      },
      desc: {
        label: i18n.description,
      },
      created_at: {
        label: i18n.created_at,
        width: 170,
      },
    };

    return circuitTableColumns;
  }, []);

  const [page, _setPage] = React.useState(0);
  const [_, setValues] = React.useState<TableValues<CircuitTableValues>>([]);

  const createRows = React.useCallback(
    (columns: TableColumns<CircuitTableValues>, values: TableValues<CircuitTableValues>) => {
      console.log(1, values, columns);

      let row = [];

      if (values === undefined || values.length < 1) {
        return row;
      }

      for (let value of values) {
        for (let id in columns) {
          let col = columns[id];
          let val = value[id];

          console.log(3, id, col, val);

          if (col && val) {
            row.push(
              <div
                className={styles.cell}
                key={col.label}
                style={{
                  width: col.width ? col.width : "auto",
                  flexGrow: col.width ? 0 : 1,
                }}
              >
                {val}
              </div>
            );
          }
        }
      }

      return <div className={styles.tableRow}>{row}</div>;
    },
    []
  );

  const handleChangeCircuitPage = React.useCallback(
    async (page: number) => {
      return prfsBackend
        .getNativeCircuits({
          page,
        })
        .then(resp => resp.payload.circuits);
    },
    [page, setValues]
  );

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
