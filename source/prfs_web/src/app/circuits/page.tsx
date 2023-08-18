"use client";

import React from "react";
import { PaddedTableWrapper } from "@taigalabs/prfs-react-components/src/table/Table";

import styles from "./Circuits.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Widget, { TopWidgetTitle, WidgetHeader, WidgetLabel } from "@/components/widget/Widget";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import { stateContext } from "@/contexts/state";
import useLocalWallet from "@/hooks/useLocalWallet";
import Card from "@/components/card/Card";
import CardRow from "@/components/card_row/CardRow";
import CircuitTable from "@/components/circuit_table/CircuitTable";

const Circuits: React.FC = () => {
  let i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);

  useLocalWallet(dispatch);

  return (
    <DefaultLayout>
      <CardRow>
        <Card>
          <Widget>
            <TopWidgetTitle>
              <WidgetLabel>{i18n.circuits}</WidgetLabel>
            </TopWidgetTitle>
            <PaddedTableWrapper>
              <CircuitTable />
            </PaddedTableWrapper>
          </Widget>
        </Card>
      </CardRow>
    </DefaultLayout>
  );
};

export default Circuits;
