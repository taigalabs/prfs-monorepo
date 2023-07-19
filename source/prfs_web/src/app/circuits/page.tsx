"use client";

import React from "react";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useConnect, useAddress, useSigner, metamaskWallet } from "@thirdweb-dev/react";

import styles from "./Circuits.module.scss";
import Table from "@/components/table/Table";
import { i18nContext } from "@/contexts/i18n";
import Widget from "@/components/widget/Widget";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import { proveMembership, proveMembershipMock } from "@/functions/prfsCrypto";

const metamaskConfig = metamaskWallet();

const Circuits: React.FC = () => {
  let i18n = React.useContext(i18nContext);

  return (
    <DefaultLayout>
      <Widget label={i18n.circuits}>
        <Table columns={[]} onChangePage={() => {}} />
      </Widget>
    </DefaultLayout>
  );
};

export default Circuits;
