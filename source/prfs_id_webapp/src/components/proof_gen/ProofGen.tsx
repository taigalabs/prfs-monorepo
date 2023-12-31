"use client";

import React from "react";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import { DriverEvent, ProveReceipt } from "@taigalabs/prfs-driver-interface";
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

import styles from "./ProofGen.module.scss";
import { i18nContext } from "@/i18n/context";
import { validateInputs } from "@/functions/validate_inputs";
import TutorialStepper from "@/components/tutorial/TutorialStepper";
import { envs } from "@/envs";
import CircuitInputs from "./CircuitInputs";

enum LoadDriverStatus {
  Standby,
  InProgress,
}

enum CreateProofStatus {
  Standby,
  InProgress,
  Created,
  Error,
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

  return <div className={styles.progressWrapper}>{el}</div>;
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

const ProofGen: React.FC<ProofGenProps> = (
  {
    // proofType,
    // handleCreateProofResult,
    // proofGenElement,
    // setProofGenElement,
  },
) => {
  const i18n = React.useContext(i18nContext);
  const [driverMsg, setDriverMsg] = React.useState<React.ReactNode>(null);
  const [loadDriverProgress, setLoadDriverProgress] = React.useState<Record<string, any>>({});
  const [loadDriverStatus, setLoadDriverStatus] = React.useState(LoadDriverStatus.Standby);
  const [systemMsg, setSystemMsg] = React.useState<string | null>(null);
  const [createProofStatus, setCreateProofStatus] = React.useState(CreateProofStatus.Standby);
  const [formValues, setFormValues] = React.useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  const lastInitProofTypeId = React.useRef<string | null>(null);
  const searchParams = useSearchParams();
  const proofGenArgs = React.useMemo(() => {
    try {
      const args = parseProofGenSearchParams(searchParams as URLSearchParams);
      return args;
    } catch (err) {
      return null;
    }
  }, [searchParams]);
  const { data, isFetching } = useProofType(proofGenArgs?.proofTypeId);
  const isTutorial = React.useMemo(() => {
    if (searchParams.get("tutorial_id")) {
      return true;
    }
    return false;
  }, [searchParams]);

  const handleClickCreateProof = React.useCallback(async () => {
    // if (proofGenElement) {
    //   try {
    //     const inputs = await validateInputs(formValues, proofType, setFormErrors);
    //     if (inputs === null) {
    //       return;
    //     }
    //     if (createProofStatus === CreateProofStatus.InProgress) {
    //       return;
    //     }
    //     setCreateProofStatus(CreateProofStatus.InProgress);
    //     const proveReceipt = await proofGenElement.createProof(inputs, proofType.circuit_type_id);
    //     setCreateProofStatus(CreateProofStatus.Created);
    //     handleCreateProofResult(null, proveReceipt);
    //   } catch (error: unknown) {
    //     const err = error as Error;
    //     setCreateProofStatus(CreateProofStatus.Error);
    //     setSystemMsg(err.toString());
    //     handleCreateProofResult(err, null);
    //   }
    // }
  }, [
    formValues,
    proofGenArgs,
    // proofType,
    // handleCreateProofResult,
    // proofGenElement,
    setSystemMsg,
    createProofStatus,
  ]);

  React.useEffect(() => {
    async function fn() {
      const proofType = data?.payload?.prfs_proof_type;
      console.log(11, proofType);

      if (proofType) {
        const since = dayjs();

        function handleDriverEv(ev: DriverEvent) {
          console.log("123123", ev);
          const { type, payload } = ev;

          if (!proofType) {
            return;
          }

          if (type === "LOAD_DRIVER_EVENT") {
            if (payload.asset_label && payload.progress) {
              setLoadDriverProgress(oldVal => ({
                ...oldVal,
                [payload.asset_label!]: payload.progress,
              }));
            }
          }

          if (type === "LOAD_DRIVER_SUCCESS") {
            const now = dayjs();
            const diff = now.diff(since, "seconds", true);
            const { artifactCount } = payload;

            setDriverMsg(
              <>
                <span>Circuit driver </span>
                <a
                  href={`${envs.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT}/circuit_drivers/${proofType.circuit_driver_id}`}
                >
                  {proofType.circuit_driver_id} <BiLinkExternal />
                </a>
                <span>
                  ({diff} seconds, {artifactCount} artifacts)
                </span>
              </>,
            );
            setLoadDriverStatus(LoadDriverStatus.Standby);
          }

          if (type === "CREATE_PROOF_EVENT") {
            setSystemMsg(payload.payload);
          }
        }

        const driverProperties = interpolateSystemAssetEndpoint(
          proofType.driver_properties,
          `${envs.NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT}/assets/circuits`,
        );

        setLoadDriverStatus(LoadDriverStatus.InProgress);
        await initCircuitDriver(proofType.circuit_driver_id, driverProperties, handleDriverEv);
      }
    }
    fn().then();
  }, [
    data?.payload,
    setCreateProofStatus,
    setLoadDriverProgress,
    setLoadDriverStatus,
    setSystemMsg,
    setDriverMsg,
  ]);

  // React.useEffect(() => {
  //   async function fn() {
  //     if (lastInitProofTypeId.current && lastInitProofTypeId.current === proofType.proof_type_id) {
  //       return;
  //     }
  //     lastInitProofTypeId.current = proofType.proof_type_id;

  //     const { circuit_driver_id, driver_properties } = proofType;
  //     setLoadDriverStatus(LoadDriverStatus.InProgress);
  //     setDriverMsg(<span>Loading driver {proofType.circuit_driver_id}...</span>);

  //     const since = dayjs();
  //     try {
  //       const elem = (await prfsSDK.create("proof_gen", {
  //         proofTypeId: proofType.proof_type_id,
  //         circuit_driver_id,
  //         driver_properties,
  //         sdkEndpoint: process.env.NEXT_PUBLIC_PRFS_SDK_WEB_ENDPOINT,
  //       })) as ProofGenElement;

  //       elem.subscribe((ev: ProofGenEvent) => {
  //         const { type, payload } = ev;

  //         if (type === "LOAD_DRIVER_EVENT") {
  //           if (payload.asset_label && payload.progress) {
  //             setLoadDriverProgress(oldVal => ({
  //               ...oldVal,
  //               [payload.asset_label!]: payload.progress,
  //             }));
  //           }
  //         }

  //         if (type === "LOAD_DRIVER_SUCCESS") {
  //           const now = dayjs();
  //           const diff = now.diff(since, "seconds", true);
  //           const { artifactCount } = payload;

  //           setDriverMsg(
  //             <>
  //               <span>Circuit driver </span>
  //               <a
  //                 href={`${envs.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT}/circuit_drivers/${circuit_driver_id}`}
  //               >
  //                 {proofType.circuit_driver_id} <BiLinkExternal />
  //               </a>
  //               <span>
  //                 ({diff} seconds, {artifactCount} artifacts)
  //               </span>
  //             </>,
  //           );
  //           setLoadDriverStatus(LoadDriverStatus.Standby);
  //         }

  //         if (type === "CREATE_PROOF_EVENT") {
  //           setSystemMsg(payload.payload);
  //         }
  //       });

  //       setProofGenElement(elem);
  //       return elem;
  //     } catch (err) {
  //       setDriverMsg(`Driver init failed, id: ${circuit_driver_id}, err: ${err}`);
  //     }
  //   }

  //   fn().then();
  // }, [
  //   proofType,
  //   setProofGenElement,
  //   setCreateProofStatus,
  //   setLoadDriverProgress,
  //   setLoadDriverStatus,
  //   setSystemMsg,
  //   setDriverMsg,
  // ]);
  // if (!data || !data.payload) {
  //   return <div>Loading...</div>;
  // }

  const proofType = data?.payload?.prfs_proof_type;
  if (!proofType) {
    return <div>Loading...</div>;
  }

  return (
    proofType && (
      <>
        <div className={cn(styles.wrapper, { [styles.isTutorial]: isTutorial })}>
          <div className={styles.driverMsg}>
            <div className={styles.msg}>{driverMsg}</div>
            {loadDriverStatus === LoadDriverStatus.InProgress && (
              <LoadDriverProgress progress={loadDriverProgress} />
            )}
          </div>
          <div className={cn(styles.main, { [styles.isTutorial]: isTutorial })}>
            <div className={styles.moduleArea}>
              <div className={styles.moduleWrapper}>
                {loadDriverStatus === LoadDriverStatus.InProgress ||
                  (createProofStatus === CreateProofStatus.InProgress && (
                    <div className={styles.loaderBarWrapper}>
                      <LoaderBar />
                    </div>
                  ))}
                {loadDriverStatus === LoadDriverStatus.InProgress && (
                  <div className={styles.overlay}>
                    <Spinner size={32} color={colors.blue_12} />
                  </div>
                )}
                <TutorialStepper steps={[2]}>
                  <div className={styles.form}>
                    <CircuitInputs
                      circuitInputs={proofType.circuit_inputs as CircuitInput[]}
                      // proofGenElement={proofGenElement}
                      formValues={formValues}
                      setFormValues={setFormValues}
                      formErrors={formErrors}
                      setFormErrors={setFormErrors}
                    />
                  </div>
                </TutorialStepper>
                <div className={styles.btnRow}>
                  <Button
                    variant="blue_1"
                    handleClick={handleClickCreateProof}
                    className={cn(styles.createBtn, {
                      [styles.inProgress]: createProofStatus === CreateProofStatus.InProgress,
                    })}
                  >
                    {i18n.create_proof.toUpperCase()}
                  </Button>
                </div>
                {systemMsg && (
                  <div className={styles.footer}>
                    <div
                      className={cn(styles.msg, {
                        [styles.errorMsg]: createProofStatus === CreateProofStatus.Error,
                      })}
                    >
                      {systemMsg}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    )
  );
};

export default ProofGen;

export interface ProofGenProps {}

export interface LoadDriverProgressProps {
  progress: Record<string, any>;
}
