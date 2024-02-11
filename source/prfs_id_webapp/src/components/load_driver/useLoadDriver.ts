import React from "react";
import { CircuitDriver, DriverEvent } from "@taigalabs/prfs-driver-interface";
import dayjs from "dayjs";
import { initCircuitDriver, interpolateSystemAssetEndpoint } from "@taigalabs/prfs-proof-gen-js";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";

import { envs } from "@/envs";

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

        const { circuit_driver_id } = proofType;
        if (!circuit_driver_id) {
          console.error("Circuit driver id is not given");
          return undefined;
        }

        switch (circuit_driver_id) {
          case "spartan_circom_v1": {
          }
        }

        // const driverProps = interpolateSystemAssetEndpoint(
        //   proofType.driver_properties,
        //   `${envs.NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT}/assets/circuits`,
        // );

        // setLoadDriverStatus(LoadDriverStatus.InProgress);
        const driver = await initCircuitDriver(
          proofType.circuit_driver_id,
          handleDriverEv,
          `${envs.NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT}/assets/circuits`,
        );
        // setDriver(driver);
      }
    }
    fn().then();
  }, [setLoadDriverProgress, setDriverArtifacts, proofType]);

  return {
    driver,
    driverArtifacts,
    loadDriverStatus,
    loadDriverProgress,
  };
}
