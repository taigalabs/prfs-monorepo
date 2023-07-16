"use client";

import React from "react";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useConnect, useAddress, useSigner, metamaskWallet } from "@thirdweb-dev/react";

import Table from "@/components/table/Table";
import styles from "./Generate.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Widget from "@/components/widget/Widget";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import { proveMembershipMock } from "@/fns/prfsMock";
import { proveMembership } from "@/fns/prfs";

const metamaskConfig = metamaskWallet();

const Generate: React.FC = () => {
  let i18n = React.useContext(i18nContext);

  const proverAddressMembershipMock = React.useCallback(() => {
    proveMembershipMock().then(() => {});
  }, []);

  const connect = useConnect();

  const proverAddressMembership = React.useCallback(() => {
    const fn = async () => {
      const wallet = await connect(metamaskConfig);

      // console.log("wallet", wallet);
      const signer = await wallet.getSigner();

      console.log(44, signer);

      proveMembership(signer).then(() => {});
    };

    fn().then();
  }, []);

  return (
    <DefaultLayout>
      <Widget label={i18n.choose_proof_type}>
        <Table />
      </Widget>
      <div>
        <button onClick={proverAddressMembership}>btn</button>
      </div>
    </DefaultLayout>
  );
};

export default Generate;

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
