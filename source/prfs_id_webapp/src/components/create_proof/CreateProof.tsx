"use client";

import React from "react";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import {
  CircuitDriver,
  CreateProofEvent,
  DriverEvent,
  ProveReceipt,
} from "@taigalabs/prfs-driver-interface";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import Spinner from "@taigalabs/prfs-react-components/src/spinner/Spinner";
import LoaderBar from "@taigalabs/prfs-react-components/src/loader_bar/LoaderBar";
// import { PrfsSDK } from "@taigalabs/prfs-sdk-web";
import dayjs from "dayjs";
import cn from "classnames";
import { useSearchParams } from "next/navigation";
import { BiLinkExternal } from "@react-icons/all-files/bi/BiLinkExternal";
// import { ProofGenElement } from "@taigalabs/prfs-sdk-web";
import colors from "@taigalabs/prfs-react-components/src/colors.module.scss";
import { parseProofGenSearchParams } from "@taigalabs/prfs-id-sdk-web/proof_gen";
import { GetPrfsProofTypeByProofTypeIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsProofTypeByProofTypeIdRequest";
import { useQuery } from "@tanstack/react-query";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
// import { ProofGenEvent } from "@taigalabs/prfs-sdk-web/src/elems/proof_gen/types";
import { initCircuitDriver, interpolateSystemAssetEndpoint } from "@taigalabs/prfs-proof-gen-js";

import styles from "./CreateProof.module.scss";
import { i18nContext } from "@/i18n/context";
import { validateInputs } from "@/functions/validate_inputs";
import TutorialStepper from "@/components/tutorial/TutorialStepper";
import { envs } from "@/envs";
import CircuitInputs from "@/components/circuit_inputs/CircuitInputs";
import { CreateProofQuery, PrfsIdCredential } from "@taigalabs/prfs-id-sdk-web";
import { TbNumbers } from "@taigalabs/prfs-react-components/src/tabler_icons/TbNumbers";
import {
  QueryItem,
  QueryItemLeftCol,
  QueryItemMeta,
  QueryItemRightCol,
  QueryName,
} from "../default_module/QueryItem";
import { ProofGenReceiptRaw } from "../proof_gen/receipt";

enum Status {
  Standby,
  InProgress,
}

const LoadDriverProgress: React.FC<LoadDriverProgressProps> = ({ progress }) => {
  const el = React.useMemo(() => {
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
  }, [progress]);

  return <div className={styles.driverProgress}>{el}</div>;
};

function useProofType(proofTypeId: string | undefined) {
  return useQuery({
    queryKey: ["get_prfs_proof_type_by_proof_type_id", proofTypeId],
    queryFn: () => {
      if (proofTypeId) {
        return prfsApi2("get_prfs_proof_type_by_proof_type_id", { proof_type_id: proofTypeId });
      }
    },
  });
}

const CreateProof: React.FC<CreateProofProps> = ({ credential, query, setReceipt }) => {
  const i18n = React.useContext(i18nContext);
  const [driverMsg, setDriverMsg] = React.useState<React.ReactNode>(null);
  const [loadDriverProgress, setLoadDriverProgress] = React.useState<Record<string, any>>({});
  const [loadDriverStatus, setLoadDriverStatus] = React.useState(Status.Standby);
  const [driver, setDriver] = React.useState<CircuitDriver | null>(null);
  const [systemMsg, setSystemMsg] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [createProofStatus, setCreateProofStatus] = React.useState(Status.Standby);
  const [formValues, setFormValues] = React.useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  const searchParams = useSearchParams();
  const { data, isFetching } = useProofType(query?.proofTypeId);
  const isTutorial = React.useMemo(() => {
    if (searchParams.get("tutorial_id")) {
      return true;
    }
    return false;
  }, [searchParams]);
  const handleProofGenEvent = React.useCallback((ev: CreateProofEvent) => {
    const { payload } = ev;
    setSystemMsg(payload.payload);
  }, []);

  React.useEffect(() => {
    const { name } = query;
    setReceipt(() => ({
      [name]: async () => {
        const proofType = data?.payload?.prfs_proof_type;
        if (!proofType) {
          return;
        }
        if (!driver) {
          return;
        }
        if (createProofStatus === Status.InProgress) {
          return;
        }
        try {
          const inputs = await validateInputs(formValues, proofType, setFormErrors);
          if (inputs === null) {
            console.error("Input validation fail to create a proof");
          }
          setCreateProofStatus(Status.InProgress);
          const proveReceipt = await driver.prove({
            inputs,
            circuitTypeId: proofType.circuit_type_id,
            eventListener: handleProofGenEvent,
          });
          setCreateProofStatus(Status.Standby);
          return proveReceipt;
        } catch (err: any) {
          setCreateProofStatus(Status.Standby);
          setSystemMsg(err.toString());
          throw err;
        }
      },
    }));
  }, [formValues, setReceipt, query, driver]);

  React.useEffect(() => {
    async function fn() {
      const proofType = data?.payload?.prfs_proof_type;
      if (proofType) {
        const since = dayjs();
        function handleDriverEv(ev: DriverEvent) {
          const { type, payload } = ev;
          if (!proofType) {
            return;
          }

          switch (type) {
            case "LOAD_DRIVER_EVENT": {
              if (payload.asset_label && payload.progress) {
                setLoadDriverProgress(oldVal => ({
                  ...oldVal,
                  [payload.asset_label!]: payload.progress,
                }));
              }
              break;
            }
            case "LOAD_DRIVER_SUCCESS": {
              const now = dayjs();
              const diff = now.diff(since, "seconds", true);
              const { artifactCount } = payload;
              setDriverMsg(
                <div>
                  <p>
                    <span>Circuit driver </span>
                    <a
                      href={`${envs.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT}/circuit_drivers/${proofType.circuit_driver_id}`}
                    >
                      {proofType.circuit_driver_id} <BiLinkExternal />
                    </a>
                  </p>
                  <p>
                    ({diff} seconds, {artifactCount} artifacts)
                  </p>
                </div>,
              );
              setLoadDriverStatus(Status.Standby);
              break;
            }
            default: {
              console.error("Cannot handle this type of driver msg", ev);
              break;
            }
          }
        }

        const driverProperties = interpolateSystemAssetEndpoint(
          proofType.driver_properties,
          `${envs.NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT}/assets/circuits`,
        );
        setLoadDriverStatus(Status.InProgress);
        const driver = await initCircuitDriver(
          proofType.circuit_driver_id,
          driverProperties,
          handleDriverEv,
        );
        setDriver(driver);
      }
    }
    fn().then();
  }, [
    data,
    query,
    setCreateProofStatus,
    setLoadDriverProgress,
    setLoadDriverStatus,
    setSystemMsg,
    setDriverMsg,
    setDriver,
    setReceipt,
  ]);

  const proofType = data?.payload?.prfs_proof_type;
  if (!proofType) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <QueryItem sidePadding>
        <QueryItemMeta>
          <QueryItemLeftCol>
            {createProofStatus === Status.InProgress ? (
              <Spinner size={20} borderWidth={2} />
            ) : (
              <TbNumbers />
            )}
          </QueryItemLeftCol>
          <QueryItemRightCol>
            <QueryName>{query.name}</QueryName>
            <div>{proofType.proof_type_id}</div>
            <div className={styles.driverMsg}>
              {driverMsg}
              {loadDriverStatus === Status.InProgress && (
                <LoadDriverProgress progress={loadDriverProgress} />
              )}
            </div>
          </QueryItemRightCol>
        </QueryItemMeta>
        <div className={cn(styles.wrapper, { [styles.isTutorial]: isTutorial })}>
          <div className={styles.moduleWrapper}>
            {loadDriverStatus === Status.InProgress && (
              <div className={styles.overlay}>
                <Spinner size={32} color={colors.blue_12} />
              </div>
            )}
            <TutorialStepper steps={[2]}>
              <div className={styles.form}>
                <CircuitInputs
                  circuitInputs={proofType.circuit_inputs as CircuitInput[]}
                  formValues={formValues}
                  setFormValues={setFormValues}
                  formErrors={formErrors}
                  setFormErrors={setFormErrors}
                />
              </div>
            </TutorialStepper>
            {systemMsg && <div className={styles.systemMsg}>{systemMsg}</div>}
            {errorMsg && <div className={cn(styles.systemMsg, styles.red)}>{errorMsg}</div>}
          </div>
        </div>
      </QueryItem>
    </>
  );
};

export default CreateProof;

export interface CreateProofProps {
  credential: PrfsIdCredential;
  query: CreateProofQuery;
  setReceipt: React.Dispatch<React.SetStateAction<ProofGenReceiptRaw | null>>;
}

export interface LoadDriverProgressProps {
  progress: Record<string, any>;
}
