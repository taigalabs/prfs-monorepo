"use client";

import React from "react";

import styles from "./CircuitTypes.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Widget, { WidgetHeader, WidgetLabel } from "@/components/widget/Widget";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import { stateContext } from "@/contexts/state";
import useLocalWallet from "@/hooks/useLocalWallet";
import Card from "@/components/card/Card";
import CardRow from "@/components/card_row/CardRow";
import CircuitTypeTable from "@/components/circuit_type_table/CircuitTypeTable";
import { PaddedTableWrapper } from "@/components/table/Table";

const CircuitTypes: React.FC = () => {
  let i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);

  useLocalWallet(dispatch);

  return (
    <DefaultLayout>
      <CardRow>
        <Card>
          <Widget>
            <div className={styles.topWidgetTitle}>
              <WidgetLabel>{i18n.circuit_types}</WidgetLabel>
            </div>
            <PaddedTableWrapper>
              <CircuitTypeTable />
            </PaddedTableWrapper>
          </Widget>
        </Card>
      </CardRow>
    </DefaultLayout>
  );
};

export default CircuitTypes;
