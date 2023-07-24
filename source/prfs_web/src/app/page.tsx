"use client";

import React from "react";

import { stateContext } from "@/contexts/state";
import styles from "./Home.module.scss";
import Table from "@/components/table/Table";
import Widget from "@/components/widget/Widget";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import useLocalWallet from "@/hooks/useLocalWallet";
import Teaser from "@/components/teaser/Teaser";
import Card from "@/components/card/Card";
import CardRow from "@/components/card_row/CardRow";

const Home: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);

  useLocalWallet(dispatch);

  React.useCallback(() => {}, []);

  return process.env.NEXT_PUBLIC_IS_TEASER === "yes" ? (
    <Teaser />
  ) : (
    <DefaultLayout>
      <div className={styles.wrapper}>
        <CardRow>
          <Card>
            <Widget label={i18n.proofs}>
              <Table columns={{ label: {} }} onChangePage={() => {}} />
            </Widget>
          </Card>
        </CardRow>
        <CardRow>
          <Card>
            <Widget label={i18n.proof_types}>
              <Table columns={[]} onChangePage={() => {}} />
            </Widget>
          </Card>
        </CardRow>
      </div>
    </DefaultLayout>
  );
};

export default Home;
// headerClassName={styles.tableHeader}
// columns={circuitTableColumns}
// createRows={createRows}
// onChangePage={handleChangeCircuitPage}
