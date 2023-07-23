"use client";

import React from "react";

import styles from "./Circuits.module.scss";
import Table from "@/components/table/Table";
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

  const handleChangeCircuitPage = React.useCallback(() => {
    async function fn() {
      await prfsBackend.getCircuits();
    }

    fn().then();
  }, []);

  return (
    <DefaultLayout>
      <CardRow>
        <Card>
          <Widget label={i18n.circuits}>
            <Table columns={{ pwer: 1 }} onChangePage={handleChangeCircuitPage} />
          </Widget>
        </Card>
      </CardRow>
    </DefaultLayout>
  );
};

export default Circuits;
