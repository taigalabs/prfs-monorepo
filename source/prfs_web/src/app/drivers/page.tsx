"use client";

import React from "react";

import styles from "./Programs.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Widget, { WidgetHeader, WidgetLabel } from "@/components/widget/Widget";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import { stateContext } from "@/contexts/state";
import useLocalWallet from "@/hooks/useLocalWallet";
import Card from "@/components/card/Card";
import CardRow from "@/components/card_row/CardRow";
import CircuitDriverTable from "@/components/circuit_driver_table/CircuitDriverTable";

const Programs: React.FC = () => {
  let i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);

  useLocalWallet(dispatch);

  return (
    <DefaultLayout>
      <CardRow>
        <Card>
          <Widget>
            <WidgetHeader>
              <WidgetLabel>{i18n.programs}</WidgetLabel>
            </WidgetHeader>
            <CircuitDriverTable />
          </Widget>
        </Card>
      </CardRow>
    </DefaultLayout>
  );
};

export default Programs;
