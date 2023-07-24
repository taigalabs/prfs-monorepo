"use client";

import React from "react";

import styles from "./Circuits.module.scss";
import Table, { TableColumns } from "@/components/table/Table";
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
    let circuitTableColumns: TableColumns<any> = {
      name: {
        label: i18n.name,
        width: 100,
      },
      author: {
        label: i18n.author,
        width: 130,
      },
      num_public_inputs: {
        label: i18n.num_public_inputs,
        width: 130,
      },
      desc: {
        label: i18n.description,
      },
      created_at: {
        label: i18n.created_at,
        width: 100,
      },
    };

    return circuitTableColumns;
  }, []);

  const [page, setPage] = React.useState(0);
  const [values, setValues] = React.useState([]);

  const handleChangeCircuitPage = React.useCallback(
    (page: number) => {
      async function fn() {
        let resp = await prfsBackend.getNativeCircuits({
          page,
        });

        setValues(resp.payload.circuits);
      }

      fn().then();
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
              values={values as any}
              onChangePage={handleChangeCircuitPage}
            />
          </Widget>
        </Card>
      </CardRow>
    </DefaultLayout>
  );
};

export default Circuits;
