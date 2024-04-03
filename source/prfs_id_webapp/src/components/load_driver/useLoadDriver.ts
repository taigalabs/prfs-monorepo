import React from "react";
import { CircuitDriver, DriverEvent } from "@taigalabs/prfs-driver-interface";
import dayjs from "dayjs";
import { initCircuitDriver } from "@taigalabs/prfs-proof-gen-js";
import { PrfsProofTypeSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofTypeSyn1";
import { SpartanCircomDriverProperties } from "@taigalabs/prfs-driver-interface/bindings/SpartanCircomDriverProperties";
import { interpolateSystemAssetEndpoint } from "@taigalabs/prfs-circuit-artifact-uri-resolver";
import { O1jsDriverProperties } from "@taigalabs/prfs-driver-o1js";

import { envs } from "@/envs";
import { useAppDispatch } from "@/state/hooks";
import { setGlobalMsg } from "@/state/globalMsgReducer";

export enum LoadDriverStatus {
  Standby,
  InProgress,
  Error,
}

export interface DriverArtifacts {
  diff: string;
  artifactCount: number;
}

export function useLoadDriver(proofType: PrfsProofTypeSyn1 | undefined) {
  const [loadDriverProgress, setLoadDriverProgress] = React.useState<Record<string, any> | null>(
    null,
  );
  const [loadDriverStatus, setLoadDriverStatus] = React.useState(LoadDriverStatus.Standby);
  const [driverArtifacts, setDriverArtifacts] = React.useState<DriverArtifacts | null>(null);
  const [driver, setDriver] = React.useState<CircuitDriver | null>(null);
  const dispatch = useAppDispatch();

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
            case "LOAD_DRIVER_ERROR": {
              console.log("load driver error", payload);

              dispatch(setGlobalMsg({ variant: "error", message: payload.message }));
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
            const driverProps_ = proofType.driver_properties as SpartanCircomDriverProperties;

            const wtns_gen_url = interpolateSystemAssetEndpoint(
              driverProps_.wtns_gen_url,
              `${envs.NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT}/circuits/`,
            );

            const circuit_url = interpolateSystemAssetEndpoint(
              driverProps_.circuit_url,
              `${envs.NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT}/circuits/`,
            );

            const driverProps = {
              ...driverProps_,
              wtns_gen_url,
              circuit_url,
            };

            setLoadDriverStatus(LoadDriverStatus.InProgress);
            const driver = await initCircuitDriver(
              proofType.circuit_driver_id,
              driverProps,
              handleDriverEv,
            );

            if (driver) {
              setDriver(driver);
              setLoadDriverStatus(LoadDriverStatus.Standby);
            } else {
              setLoadDriverStatus(LoadDriverStatus.Error);
            }

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
  }, [setLoadDriverProgress, setDriverArtifacts, proofType, dispatch]);

  return {
    driver,
    driverArtifacts,
    loadDriverStatus,
    loadDriverProgress,
  };
}
