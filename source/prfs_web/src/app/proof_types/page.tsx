"use client";

import React from "react";

import styles from "./ProofTypes.module.scss";
import Table from "@/components/table/Table";
import { i18nContext } from "@/contexts/i18n";
import Widget from "@/components/widget/Widget";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import { stateContext } from "@/contexts/state";
import useLocalWallet from "@/hooks/useLocalWallet";
import Card from "@/components/card/Card";

const Proofs: React.FC = () => {
  let i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);

  useLocalWallet(dispatch);

  return (
    <DefaultLayout>
      <Card>
        <Widget label={i18n.proofs}>
          asdf
          {/* <Table columns={[]} onChangePage={() => {}} /> */}
        </Widget>
      </Card>
    </DefaultLayout>
  );
};

export default Proofs;
