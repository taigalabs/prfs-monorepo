"use client";

import React from "react";

import styles from "./CreateProofTypePage.module.scss";
import Table, { TableData } from "@/components/table/Table";
import { i18nContext } from "@/contexts/i18n";
import Widget from "@/components/widget/Widget";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import { stateContext } from "@/contexts/state";
import useLocalWallet from "@/hooks/useLocalWallet";
import Card from "@/components/card/Card";
import prfsBackend from "@/fetch/prfsBackend";
import CardRow from "@/components/card_row/CardRow";
import Button from "@/components/button/Button";

const Proofs: React.FC = () => {
  let i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);

  useLocalWallet(dispatch);

  return (
    <DefaultLayout>
      <div>
        <div>
          <Card>
            <Widget label={i18n.proof_types}>wewer</Widget>
          </Card>
          <Card>
            <Widget label={i18n.proof_types}>wewer</Widget>
          </Card>
          <Card>
            <Widget label={i18n.proof_types}>wewer</Widget>
          </Card>
        </div>
        <div>button row</div>
      </div>
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
