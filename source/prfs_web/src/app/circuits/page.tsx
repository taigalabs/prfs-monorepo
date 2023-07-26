"use client";

import React from "react";

import styles from "./Circuits.module.scss";
import Table, { TableData } from "@/components/table/Table";
import { i18nContext } from "@/contexts/i18n";
import Widget from "@/components/widget/Widget";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import { stateContext } from "@/contexts/state";
import useLocalWallet from "@/hooks/useLocalWallet";
import Card from "@/components/card/Card";
import CardRow from "@/components/card_row/CardRow";
import prfsBackend from "@/fetch/prfsBackend";
import SetTable from "@/components/set_table/SetTable";

const Circuits: React.FC = () => {
  let i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);

  useLocalWallet(dispatch);

  return (
    <DefaultLayout>
      <CardRow>
        <Card>
          <Widget label={i18n.circuits}>
            <div className={styles.wrapper}>
              <SetTable />
            </div>
          </Widget>
        </Card>
      </CardRow>
    </DefaultLayout>
  );
};

export default Circuits;

const CIRCUIT_TABLE_KEYS = [
  "id",
  "name",
  "author",
  "num_public_inputs",
  "desc",
  "created_at",
] as const;

type CircuitTableKeys = (typeof CIRCUIT_TABLE_KEYS)[number];
