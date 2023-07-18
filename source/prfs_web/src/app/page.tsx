"use client";

import React from "react";
import { ethers } from "ethers";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";

import { stateContext } from "@/contexts/state";
import styles from "./Home.module.scss";
import Masthead from "@/components/masthead/Masthead";
import LeftBar from "@/components/leftbar/LeftBar";
import Table from "@/components/table/Table";
import Widget from "@/components/widget/Widget";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import localStorage from "@/storage/localStorage";

const Home: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const { state, dispatch } = React.useContext(stateContext);

  React.useEffect(() => {
    let prfsAccount = localStorage.getPrfsAccount();

    if (prfsAccount !== null) {
      dispatch({
        type: "load_prfs_account",
        payload: prfsAccount,
      });
    }
  }, []);

  return (
    <DefaultLayout>
      <Paper className={styles.paper}>
        <Widget label={i18n.proofs}>
          <Table />
        </Widget>
      </Paper>
      <Paper className={styles.paper}>
        <Widget label={i18n.proof_types}>
          <Table />
        </Widget>
      </Paper>
    </DefaultLayout>
  );
};

export default Home;
