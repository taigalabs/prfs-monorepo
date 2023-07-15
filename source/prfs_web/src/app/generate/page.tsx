"use client";

import React from "react";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Link from "next/link";

import Table from "@/components/table/Table";
import styles from "./Generate.module.scss";
import { I18nContext } from "@/contexts";
import Widget from "@/components/widget/Widget";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";

const Generate: React.FC = () => {
  let i18n = React.useContext(I18nContext);

  return (
    <DefaultLayout>
      <Paper className={styles.paper}>
        <Widget label={i18n.choose_proof_type}>
          <Table />
        </Widget>
      </Paper>
    </DefaultLayout>
  );
};

export default Generate;
