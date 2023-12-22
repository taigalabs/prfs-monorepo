import React from "react";
import cn from "classnames";
import {
  prfsSign,
  type PrfsIdCredential,
  poseidon_2,
  makeECCredential,
} from "@taigalabs/prfs-crypto-js";
import { FaRegAddressCard } from "@react-icons/all-files/fa/FaRegAddressCard";
import { CommitmentData } from "@taigalabs/prfs-id-sdk-web";

import styles from "./CommitmentView.module.scss";
import { i18nContext } from "@/i18n/context";

const CommitmentView: React.FC<CommitmentViewProps> = ({
  commitmentData,
  commitmentReceipt,
  // credential,
  // appId,
  // setSignInData,
}) => {
  const i18n = React.useContext(i18nContext);

  // const elems = React.useMemo(() => {
  //   for (const key in commitmentData) {
  //     const { val, type } =
  //   }
  //   return null;
  // }, [commitmentData, commitmentReceipt]);

  return (
    <>
      <ul className={styles.wrapper}></ul>
    </>
  );
};

export default CommitmentView;

export interface CommitmentViewProps {
  commitmentData: CommitmentData;
  commitmentReceipt: Record<string, string>;
  // credential: PrfsIdCredential;
  // appId: string;
}
