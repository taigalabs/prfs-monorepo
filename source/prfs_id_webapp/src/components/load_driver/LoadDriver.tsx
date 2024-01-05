"use client";

import React from "react";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import { CircuitDriver, CreateProofEvent, DriverEvent } from "@taigalabs/prfs-driver-interface";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import dayjs from "dayjs";
import cn from "classnames";
import { BiLinkExternal } from "@react-icons/all-files/bi/BiLinkExternal";
import colors from "@taigalabs/prfs-react-lib/src/colors.module.scss";
import { useQuery } from "@tanstack/react-query";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { initCircuitDriver, interpolateSystemAssetEndpoint } from "@taigalabs/prfs-proof-gen-js";
import { CreateProofQuery, PrfsIdCredential, TutorialArgs } from "@taigalabs/prfs-id-sdk-web";
import { TbNumbers } from "@taigalabs/prfs-react-lib/src/tabler_icons/TbNumbers";
import TutorialStepper from "@taigalabs/prfs-react-lib/src/tutorial/TutorialStepper";

import styles from "./CreateProof.module.scss";
import { i18nContext } from "@/i18n/context";
import { validateInputs } from "@/functions/validate_inputs";
import { envs } from "@/envs";
import CircuitInputs from "@/components/circuit_inputs/CircuitInputs";
import {
  QueryItem,
  QueryItemLeftCol,
  QueryItemMeta,
  QueryItemRightCol,
  QueryName,
} from "@/components/default_module/QueryItem";
import { ProofGenReceiptRaw } from "@/components/proof_gen/receipt";
import { useAppSelector } from "@/state/hooks";

export const LoadDriverProgress: React.FC<LoadDriverProgressProps> = ({ progress }) => {
  const el = React.useMemo(() => {
    if (progress) {
      const elems = [];
      for (const key in progress) {
        elems.push(
          <div key={key} className={styles.progressRow}>
            <p>{key}</p>
            <p>...{progress[key]}%</p>
          </div>,
        );
      }
      return elems;
    }

    return <span>Loading...</span>;
  }, [progress]);

  return <div className={styles.driverProgress}>{el}</div>;
};

export interface LoadDriverProgressProps {
  progress: Record<string, any> | null;
}
