"use client";

import React from "react";
import { ethers } from "ethers";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";

import styles from "./DefaultLayout.module.scss";
import { proveMembershipMock } from "@/prfs/mock";
import { proveMembership } from "@/prfs";
import Masthead from "@/components/masthead/Masthead";
import { useAddress, useSigner } from "@thirdweb-dev/react";
import LeftBar from "@/components/leftbar/LeftBar";
import Table from "@/components/table/Table";
import Widget from "@/components/widget/Widget";
import { I18nContext } from "@/contexts";

const DefaultLayout: React.FC<any> = ({ children }) => {
  console.log("Home()");

  const proverAddressMembershipMock = React.useCallback(() => {
    proveMembershipMock().then(() => {});
  }, []);

  const proverAddressMembership = React.useCallback(() => {
    // proveMembership(signer).then(() => { });
  }, []);

  const i18n = React.useContext(I18nContext);

  return (
    <div className={styles.wrapper}>
      <Masthead />
      <div className={styles.bottom}>
        <LeftBar />
        <div className={styles.right}>{children}</div>
      </div>
    </div>
  );
};

export default DefaultLayout;

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
