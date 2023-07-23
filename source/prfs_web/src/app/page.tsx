"use client";

import React from "react";
import { ethers } from "ethers";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";

import { stateContext } from "@/contexts/state";
import styles from "./Home.module.scss";
import Masthead from "@/components/masthead/Masthead";
import LeftBar from "@/components/left_bar/LeftBar";
import Table from "@/components/table/Table";
import Widget from "@/components/widget/Widget";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import localStore from "@/storage/localStore";
import useLocalWallet from "@/hooks/useLocalWallet";
import Teaser from "@/components/teaser/Teaser";
import Card from "@/components/card/Card";

const Home: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);

  useLocalWallet(dispatch);

  return process.env.NEXT_PUBLIC_IS_TEASER === "yes" ? (
    <Teaser />
  ) : (
    <DefaultLayout>
      <div className={styles.wrapper}>
        <div className={styles.row}>
          <Card>
            <Widget label={i18n.proofs}>
              <Table columns={[]} onChangePage={() => {}} />
            </Widget>
          </Card>
        </div>
        <div className={styles.row}>
          <Card>
            <Widget label={i18n.proof_types}>
              <Table columns={[]} onChangePage={() => {}} />
            </Widget>
          </Card>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Home;
