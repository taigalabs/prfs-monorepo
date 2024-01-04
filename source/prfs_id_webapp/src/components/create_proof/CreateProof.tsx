"use client";

import React from "react";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import { CircuitDriver, CreateProofEvent, DriverEvent } from "@taigalabs/prfs-driver-interface";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import dayjs from "dayjs";
import cn from "classnames";
import { useSearchParams } from "next/navigation";
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

enum Status {
  Standby,
  InProgress,
}

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

const LoadDriverProgress: React.FC<LoadDriverProgressProps> = ({ progress }) => {
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

const CreateProof: React.FC<CreateProofProps> = ({ credential, query, setReceipt, tutorial }) => {
  const i18n = React.useContext(i18nContext);
  const [driverMsg, setDriverMsg] = React.useState<React.ReactNode>(null);
  const [loadDriverProgress, setLoadDriverProgress] = React.useState<Record<string, any> | null>(
    null,
  );
  const [loadDriverStatus, setLoadDriverStatus] = React.useState(Status.Standby);
  const [driver, setDriver] = React.useState<CircuitDriver | null>(null);
  const [systemMsg, setSystemMsg] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [createProofStatus, setCreateProofStatus] = React.useState(Status.Standby);
  const [formValues, setFormValues] = React.useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  const searchParams = useSearchParams();
  const { data } = useProofType(query?.proofTypeId);
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
          proveReceipt.proof.proofBytes = Array.from(proveReceipt.proof.proofBytes);
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
              const diff = now.diff(since, "seconds", true).toFixed(2);
              const { artifactCount } = payload;
              setDriverMsg(
                <p className={styles.result}>
                  <a
                    href={`${envs.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT}/circuit_drivers/${proofType.circuit_driver_id}`}
                  >
                    <span>{proofType.circuit_driver_id}</span>
                    <BiLinkExternal />
                  </a>
                  <span className={styles.diff}>
                    ({diff}s, {artifactCount} files)
                  </span>
                </p>,
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
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <>
      <QueryItem sidePadding>
        <QueryItemMeta>
          <QueryItemLeftCol>
            <TbNumbers />
          </QueryItemLeftCol>
          <QueryItemRightCol>
            <QueryName
              className={cn({ [styles.creating]: createProofStatus === Status.InProgress })}
            >
              <span>{query.name}</span>
              {createProofStatus === Status.InProgress && <span> (Creating...)</span>}
            </QueryName>
            <div>{proofType.proof_type_id}</div>
            <div className={styles.driverMsg}>
              {driverMsg}
              {loadDriverStatus === Status.InProgress && (
                <LoadDriverProgress progress={loadDriverProgress} />
              )}
            </div>
          </QueryItemRightCol>
        </QueryItemMeta>
        <div className={styles.wrapper}>
          <div className={styles.moduleWrapper}>
            {loadDriverStatus === Status.InProgress && (
              <div className={styles.overlay}>
                <Spinner size={32} color={colors.blue_12} />
              </div>
            )}
            <TutorialStepper
              tutorialId={tutorial ? tutorial.tutorialId : null}
              step={1}
              steps={[2]}
            >
              <div className={styles.form}>
                <CircuitInputs
                  circuitInputs={proofType.circuit_inputs as CircuitInput[]}
                  formValues={formValues}
                  setFormValues={setFormValues}
                  formErrors={formErrors}
                  setFormErrors={setFormErrors}
                  presetVals={query.presetVals}
                  credential={credential}
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
  tutorial: TutorialArgs | undefined;
}

export interface LoadDriverProgressProps {
  progress: Record<string, any> | null;
}
