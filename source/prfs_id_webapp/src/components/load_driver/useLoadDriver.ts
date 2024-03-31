import React from "react";
import { CircuitDriver, DriverEvent } from "@taigalabs/prfs-driver-interface";
import dayjs from "dayjs";
import { initCircuitDriver } from "@taigalabs/prfs-proof-gen-js";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { SpartanCircomDriverProperties } from "@taigalabs/prfs-driver-spartan-js";
import {
  resolveCircuitUrl,
  resolveWtnsGenUrl,
} from "@taigalabs/prfs-circuit-artifact-uri-resolver";

import { envs } from "@/envs";
import { O1jsDriverProperties } from "@taigalabs/prfs-driver-o1js";

export enum LoadDriverStatus {
  Standby,
  InProgress,
  Error,
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
            const wtns_gen_url = resolveWtnsGenUrl(
              `${envs.NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT}/circuits`,
              proofType.circuit_type_id,
            );

            const circuit_url = resolveCircuitUrl(
              `${envs.NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT}/circuits`,
              proofType.circuit_type_id,
            );

            const driverProps: SpartanCircomDriverProperties = {
              version: "0.0.1",
              wtns_gen_url,
              circuit_url,
            };

            setLoadDriverStatus(LoadDriverStatus.InProgress);
            const driver = await initCircuitDriver(
              proofType.circuit_driver_id,
              driverProps,
              handleDriverEv,
            );
            setDriver(driver);
            break;
          }
          case "o1js_v1": {
            const driverProps: O1jsDriverProperties = {
              transactionFee: "0.1",
              zkAppAddr: "NONE",
            };

            setLoadDriverStatus(LoadDriverStatus.InProgress);
            const driver = await initCircuitDriver(
              proofType.circuit_driver_id,
              driverProps,
              handleDriverEv,
            );
            setDriver(driver);
            break;
          }
          default:
            console.error("This circuit driver is not supported yet", circuit_driver_id);
        }
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
