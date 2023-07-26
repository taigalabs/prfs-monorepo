"use client";

import React from "react";

import styles from "./Proofs.module.scss";
import Table, { TableData } from "@/components/table/Table";
import { i18nContext } from "@/contexts/i18n";
import Widget from "@/components/widget/Widget";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import { stateContext } from "@/contexts/state";
import useLocalWallet from "@/hooks/useLocalWallet";
import Card from "@/components/card/Card";
import prfsBackend from "@/fetch/prfsBackend";
import CardRow from "@/components/card_row/CardRow";
import CircuitTable from "@/components/circuit_table/CircuitTable";

const Proofs: React.FC = () => {
  let i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);

  useLocalWallet(dispatch);

  return (
    <DefaultLayout>
      <CardRow>
        <Card>
          <Widget label={i18n.proofs}>
            <CircuitTable />
          </Widget>
        </Card>
      </CardRow>
    </DefaultLayout>
  );
};

export default Proofs;

const CIRCUIT_TABLE_KEYS = [
  "id",
  "name",
  "author",
  "num_public_inputs",
  "desc",
  "created_at",
] as const;

type CircuitTableKeys = (typeof CIRCUIT_TABLE_KEYS)[number];
