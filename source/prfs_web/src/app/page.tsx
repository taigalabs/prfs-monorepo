"use client";

import React from "react";

import { stateContext } from "@/contexts/state";
import styles from "./Home.module.scss";
import Table, { TableData } from "@/components/table/Table";
import Widget from "@/components/widget/Widget";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import useLocalWallet from "@/hooks/useLocalWallet";
import Teaser from "@/components/teaser/Teaser";
import Card from "@/components/card/Card";
import CardRow from "@/components/card_row/CardRow";
import prfsBackend from "@/fetch/prfsBackend";
import CircuitTable from "@/components/circuit_table/CircuitTable";

const Home: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);

  useLocalWallet(dispatch);

  return process.env.NEXT_PUBLIC_IS_TEASER === "yes" ? (
    <Teaser />
  ) : (
    <DefaultLayout>
      <CardRow>
        <Card>
          <Widget label={i18n.proofs}>
            <CircuitTable />
          </Widget>
        </Card>
      </CardRow>
      <CardRow>
        <Card>
          <Widget label={i18n.proof_types}>
            <CircuitTable />
          </Widget>
        </Card>
      </CardRow>
    </DefaultLayout>
  );
};

export default Home;
