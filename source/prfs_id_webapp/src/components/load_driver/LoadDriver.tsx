import React from "react";
import cn from "classnames";
import { BiLinkExternal } from "@react-icons/all-files/bi/BiLinkExternal";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";

import styles from "./LoadDriver.module.scss";
import { envs } from "@/envs";
import { DriverArtifacts, LoadDriverStatus } from "./useLoadDriver";

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

const LoadDriverResult: React.FC<LoadDriverResultProps> = ({ proofType, driverArtifacts }) => {
  const { diff, artifactCount } = driverArtifacts;
  return (
    <p className={styles.result}>
      <a
      // href={`${envs.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT}/circuit_drivers/${proofType.circuit_driver_id}`}
      >
        <span>{proofType.circuit_driver_id}</span>
        <BiLinkExternal />
      </a>
      <span className={styles.diff}>
        ({diff}s, {artifactCount} files)
      </span>
    </p>
  );
};

const LoadDriver: React.FC<LoadDriverProps> = ({
  proofType,
  loadDriverStatus,
  progress,
  driverArtifacts,
}) => {
  return (
    <div>
      {driverArtifacts && (
        <LoadDriverResult proofType={proofType} driverArtifacts={driverArtifacts} />
      )}
      {loadDriverStatus === LoadDriverStatus.InProgress && (
        <LoadDriverProgress progress={progress} />
      )}
    </div>
  );
};

export default LoadDriver;

export interface LoadDriverProps {
  proofType: PrfsProofType;
  loadDriverStatus: LoadDriverStatus;
  progress: Record<string, any> | null;
  driverArtifacts: DriverArtifacts | null;
}

interface LoadDriverResultProps {
  proofType: PrfsProofType;
  driverArtifacts: DriverArtifacts;
}

export interface LoadDriverProgressProps {
  progress: Record<string, any> | null;
}
