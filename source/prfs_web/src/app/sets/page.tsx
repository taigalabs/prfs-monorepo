"use client";

import React from "react";
import { ethers } from "ethers";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";

import styles from "./Sets.module.scss";
import { stateContext } from "@/contexts/state";
import Masthead from "@/components/masthead/Masthead";
import LeftBar from "@/components/left_bar/LeftBar";
import Table from "@/components/table/Table";
import Widget from "@/components/widget/Widget";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import localStorage from "@/storage/localStorage";

const Sets: React.FC = () => {
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
      <div className={styles.wrapper}>
        <Paper className={styles.paper}>
          <Widget label={i18n.sets}>
            <Table
              columns={[
                { key: "id", label: "Id" },
                { key: "label", label: "Label" },
                { key: "desc", label: "Desc" },
                { key: "created_at", label: "Created" },
              ]}
              onChangePage={_page => {}}
            />
          </Widget>
        </Paper>
      </div>
    </DefaultLayout>
  );
};

export default Sets;
