"use client";

import React from "react";

import styles from "./Sets.module.scss";
import { stateContext } from "@/contexts/state";
import Widget, { TopWidgetTitle, WidgetHeader, WidgetLabel } from "@/components/widget/Widget";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import useLocalWallet from "@/hooks/useLocalWallet";
import Card from "@/components/card/Card";
import CardRow from "@/components/card_row/CardRow";
import SetTable from "@/components/set_table/SetTable";
import { PaddedTableWrapper } from "@/components/table/Table";

const Sets: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);

  useLocalWallet(dispatch);

  return (
    <DefaultLayout>
      <CardRow>
        <Card>
          <Widget>
            <TopWidgetTitle>
              <WidgetLabel>{i18n.sets}</WidgetLabel>
            </TopWidgetTitle>
            <PaddedTableWrapper>
              <SetTable />
            </PaddedTableWrapper>
          </Widget>
        </Card>
      </CardRow>
    </DefaultLayout>
  );
};

export default Sets;
