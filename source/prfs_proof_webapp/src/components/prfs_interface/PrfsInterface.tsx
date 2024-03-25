import React from "react";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import cn from "classnames";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { prfsApi3 } from "@taigalabs/prfs-api-js";
import { ProveReceipt } from "@taigalabs/prfs-driver-interface";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@taigalabs/prfs-react-lib/react_query";
import JSONBig from "json-bigint";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import colors from "@taigalabs/prfs-react-lib/src/colors.module.scss";
import TutorialStepper from "@taigalabs/prfs-react-lib/src/tutorial/TutorialStepper";
import { useTutorial } from "@taigalabs/prfs-react-lib/src/hooks/tutorial";

import styles from "./PostCreateMenu.module.scss";
import { paths } from "@/paths";
import { useAppSelector } from "@/state/hooks";
import { useI18N } from "@/i18n/use_i18n";

const JSONbigNative = JSONBig({
  useNativeBigInt: true,
  alwaysParseAsBig: true,
  storeAsString: true,
});

const PrfsInterface: React.FC<PrfsInterfaceProps> = ({}) => {
  const i18n = useI18N();
  const searchParams = useSearchParams();
  const router = useRouter();

  return <div className={styles.wrapper}>{i18n.uploading_proof}...</div>;
};

export default PrfsInterface;

export interface PrfsInterfaceProps {}
