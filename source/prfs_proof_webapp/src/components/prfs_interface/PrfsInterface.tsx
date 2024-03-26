import React from "react";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import cn from "classnames";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { ProveReceipt } from "@taigalabs/prfs-driver-interface";
import { useRouter, useSearchParams } from "next/navigation";
import { JSONbigNative } from "@taigalabs/prfs-crypto-js";
import { useMutation } from "@taigalabs/prfs-react-lib/react_query";

import styles from "./PostCreateMenu.module.scss";

const PrfsInterface: React.FC<PrfsInterfaceProps> = ({}) => {
  // const searchParams = useSearchParams();
  // const router = useRouter();

  return <div className={styles.wrapper}>Uploading proof...</div>;
};

export default PrfsInterface;

export interface PrfsInterfaceProps {}
