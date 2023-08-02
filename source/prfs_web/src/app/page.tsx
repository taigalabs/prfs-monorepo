"use client";

import React from "react";

import { stateContext } from "@/contexts/state";
import styles from "./Home.module.scss";
import Widget, { WidgetHeader, WidgetLabel } from "@/components/widget/Widget";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import useLocalWallet from "@/hooks/useLocalWallet";
import Teaser from "@/components/teaser/Teaser";
import Card from "@/components/card/Card";
import CardRow from "@/components/card_row/CardRow";
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
          <Widget>
            <WidgetHeader>
              <WidgetLabel>label={i18n.proofs}</WidgetLabel>
            </WidgetHeader>
            <CircuitTable />
          </Widget>
        </Card>
      </CardRow>
      <CardRow>
        <Card>
          <Widget>
            <WidgetHeader>label={i18n.proof_types}</WidgetHeader>
            <CircuitTable />
          </Widget>
        </Card>
      </CardRow>
    </DefaultLayout>
  );
};

export default Home;
