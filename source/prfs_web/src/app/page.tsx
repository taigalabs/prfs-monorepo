"use client";

import React from "react";
import { ethers } from "ethers";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";

import styles from "./page.module.scss";
import { proveMembershipMock } from "@/prfs/mock";
import { proveMembership } from "@/prfs";
import Masthead from "@/components/masthead/Masthead";
// import getSigner from "@/fns/getSigner";
import { useAddress, useSigner } from "@thirdweb-dev/react";
import LeftBar from "@/components/leftbar/LeftBar";
import { Theme, ThemeProvider } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

const theme = makeStyles((theme: Theme) => ({
  root: {
    background: "transparent",
    spacing: theme.spacing(1)
  }
}));

const Home: React.FC = () => {
  console.log("Home()");

  const proverAddressMembershipMock = React.useCallback(() => {
    proveMembershipMock().then(() => {});
  }, []);

  const proverAddressMembership = React.useCallback(() => {
    // proveMembership(signer).then(() => { });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className={styles.wrapper}>
        <Masthead />
        <Container maxWidth="sm">
          <div className={styles.content}>
            <LeftBar />
            <div>
              body
              <button onClick={proverAddressMembershipMock}>Prove Address Membership mock</button>
              <button onClick={proverAddressMembership}>Prove Address Membership</button>
            </div>
          </div>
        </Container>
      </div>
    </ThemeProvider>
  );
};

export default Home;

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
