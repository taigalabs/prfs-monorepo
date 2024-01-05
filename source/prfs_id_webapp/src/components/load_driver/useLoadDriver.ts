import React from "react";
import { CircuitDriver, DriverEvent } from "@taigalabs/prfs-driver-interface";
import dayjs from "dayjs";
import cn from "classnames";
import { initCircuitDriver, interpolateSystemAssetEndpoint } from "@taigalabs/prfs-proof-gen-js";

import styles from "./LoadDriver.module.scss";
import { envs } from "@/envs";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";

export enum LoadDriverStatus {
  Standby,
  InProgress,
}

export interface DriverArtifacts {
  diff: string;
  artifactCount: number;
}

export function useLoadDriver(proofType: PrfsProofType | undefined) {
  const [loadDriverProgress, setLoadDriverProgress] = React.useState<Record<string, any> | null>(
    null,
  );
  const [loadDriverStatus, setLoadDriverStatus] = React.useState(LoadDriverStatus.Standby);
  const [driverArtifacts, setDriverArtifacts] = React.useState<DriverArtifacts | null>(null);
  const [driver, setDriver] = React.useState<CircuitDriver | null>(null);

  React.useEffect(() => {
    async function fn() {
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
              // setDriverMsg(
              //   <p className={styles.result}>
              //     <a
              //       href={`${envs.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT}/circuit_drivers/${proofType.circuit_driver_id}`}
              //     >
              //       <span>{proofType.circuit_driver_id}</span>
              //       <BiLinkExternal />
              //     </a>
              //     <span className={styles.diff}>
              //       ({diff}s, {artifactCount} files)
              //     </span>
              //   </p>,
              // );
              setLoadDriverStatus(LoadDriverStatus.Standby);
              setDriverArtifacts({
                diff,
                artifactCount,
              });
              break;
            }
            default: {
              console.error("Cannot handle this type of driver msg", ev);
              break;
            }
          }
        }

        const driverProps = interpolateSystemAssetEndpoint(
          proofType.driver_properties,
          `${envs.NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT}/assets/circuits`,
        );

        setLoadDriverStatus(LoadDriverStatus.InProgress);
        const driver = await initCircuitDriver(
          proofType.circuit_driver_id,
          driverProps,
          handleDriverEv,
        );
        setDriver(driver);
      }
    }
    fn().then();
  }, [setLoadDriverProgress, setDriverArtifacts]);

  return {
    driver,
    driverArtifacts,
    loadDriverStatus,
    loadDriverProgress,
  };
}
