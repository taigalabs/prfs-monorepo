"use client";

import React from "react";
import { ethers } from "ethers";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";

import styles from "./Home.module.scss";
import Masthead from "@/components/masthead/Masthead";
import LeftBar from "@/components/leftbar/LeftBar";
import Table from "@/components/table/Table";
import Widget from "@/components/widget/Widget";
import { I18nContext } from "@/contexts";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";

const Home: React.FC = () => {
  const i18n = React.useContext(I18nContext);

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

{
  /* <button onClick={proverAddressMembershipMock}>Prove Address Membership mock</button> */
}
{
  /* <button onClick={proverAddressMembership}>Prove Address Membership</button> */
}
// function getSiblingIdx(idx: number): number {
//   if (idx % 2 == 0) {
//     return idx + 1;
//   } else {
//     return idx - 1;
//   }
// }

// function getParentIdx(idx: number): number {
//   return idx / 2;
// }

// export interface NodePos {
//   posW: number;
//   posH: number;
// }
