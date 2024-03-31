"use client";

import React from "react";
import { CachedProveReceipt, CreateProofEvent } from "@taigalabs/prfs-driver-interface";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import cn from "classnames";
import colors from "@taigalabs/prfs-react-lib/src/colors.module.scss";
import { useQuery } from "@taigalabs/prfs-react-lib/react_query";
import { prfsApi3 } from "@taigalabs/prfs-api-js";
import { CreateProofQuery, PrfsIdCredential } from "@taigalabs/prfs-id-sdk-web";
import { TbNumbers } from "@taigalabs/prfs-react-lib/src/tabler_icons/TbNumbers";
import Overlay from "@taigalabs/prfs-react-lib/src/overlay/Overlay";
import { setGlobalError } from "@taigalabs/prfs-react-lib/src/global_error_reducer";

import styles from "./CreateProof.module.scss";
import { i18nContext } from "@/i18n/context";
import CircuitInputs from "@/components/circuit_inputs/CircuitInputs";
import {
  QueryItem,
  QueryItemLeftCol,
  QueryItemMeta,
  QueryItemRightCol,
  QueryName,
} from "@/components/default_module/QueryItem";
import { ProofGenReceiptRaw } from "@/components/proof_gen/receipt";
import { useAppDispatch } from "@/state/hooks";
import { LoadDriverStatus, useLoadDriver } from "@/components/load_driver/useLoadDriver";
import LoadDriver from "@/components/load_driver/LoadDriver";
import { FormHandler } from "@/components/circuit_input_items/formTypes";

enum Status {
  Standby,
  InProgress,
}

function useProofType(proofTypeId: string | undefined) {
  return useQuery({
    queryKey: ["get_prfs_proof_type_by_proof_type_id", proofTypeId],
    queryFn: () => {
      if (proofTypeId) {
        return prfsApi3({
          type: "get_prfs_proof_type_by_proof_type_id",
          proof_type_id: proofTypeId,
        });
      }
    },
  });
}

const CreateProof: React.FC<CreateProofProps> = ({ credential, query, setReceipt, handleSkip }) => {
  const i18n = React.useContext(i18nContext);
  const [systemMsg, setSystemMsg] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<React.ReactNode | null>(null);
  const dispatch = useAppDispatch();
  const [createProofStatus, setCreateProofStatus] = React.useState(Status.Standby);
  const [formHandler, setFormHandler] = React.useState<FormHandler | null>(null);
  const [formValues, setFormValues] = React.useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  const { data, error } = useProofType(query?.proofTypeId);
  const handleProofGenEvent = React.useCallback((ev: CreateProofEvent) => {
    const { payload } = ev;
    setSystemMsg(payload.payload);
  }, []);
  const { loadDriverProgress, loadDriverStatus, driver, driverArtifacts } = useLoadDriver(
    data?.payload?.prfs_proof_type,
  );

  const handleSkipCreateProof = React.useCallback(
    async (proveReceipt: CachedProveReceipt) => {
      handleSkip({
        [query.name]: proveReceipt,
      });
    },
    [query.name],
  );

  React.useEffect(() => {
    if (error) {
      dispatch(
        setGlobalError({
          message: "Error fetching proof type, something is wrong. ",
        }),
      );
    }

    if (data?.error) {
      dispatch(
        setGlobalError({
          message: "Error fetching proof type, something is wrong. ",
        }),
      );
    }
  }, [data, error, dispatch]);

  React.useEffect(() => {
    const { name } = query;

    setReceipt(oldVals => ({
      ...oldVals,
      [name]: async () => {
        const proofType = data?.payload?.prfs_proof_type;
        if (!proofType) {
          throw new Error("Proof type does not exist");
        }

        if (!driver) {
          throw new Error("Driver does not exist");
        }

        if (createProofStatus === Status.InProgress) {
          throw new Error("Create proof status is in progress");
        }

        if (!formHandler) {
          throw new Error("Form handler does not exist");
        }

        try {
          const val = await formHandler(formValues);
          const { isValid } = val;
          if (isValid === false) {
            throw new Error("Input validation fail to create a proof");
          }

          const { proofAction, proofActionSig, proofActionSigMsg } = val;
          if (!proofAction) {
            console.error("val", val.proofAction);
            throw new Error("Proof action is empty");
          }

          if (!proofActionSig) {
            throw new Error("Proof action sig is empty");
          }

          console.log("Form values", formValues);
          setCreateProofStatus(Status.InProgress);
          const proveResult = await driver.prove({
            inputs: formValues,
            circuitTypeId: proofType.circuit_type_id,
            eventListener: handleProofGenEvent,
          });

          console.log(111, proveResult);

          setCreateProofStatus(Status.Standby);
          proveResult.proof.proofBytes = Array.from(proveResult.proof.proofBytes);
          return {
            ...proveResult,
            proofAction,
            proofActionSig,
            proofActionSigMsg,
            type: "prove_receipt",
          };
        } catch (err: any) {
          setCreateProofStatus(Status.Standby);
          // setSystemMsg(err.toString());
          throw err;
        }
      },
    }));
  }, [formValues, setReceipt, query, driver, credential, formHandler]);

  const proofType = data?.payload?.prfs_proof_type;
  return proofType ? (
    <>
      <QueryItem>
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
            <p className={styles.proofTypeId}>{proofType.proof_type_id}</p>
            <div className={styles.driverMsg}>
              <LoadDriver
                proofType={proofType}
                loadDriverStatus={loadDriverStatus}
                progress={loadDriverProgress}
                driverArtifacts={driverArtifacts}
              />
            </div>
            {query.usePrfsRegistry && (
              <div className={styles.registry}>
                <input type="checkbox" checked disabled />
                <span>Use Prfs registry</span>
              </div>
            )}
          </QueryItemRightCol>
        </QueryItemMeta>
        <div className={styles.inner}>
          <div className={styles.rightCol}>
            {loadDriverStatus === LoadDriverStatus.InProgress && (
              <div className={styles.overlay}>
                <Spinner size={24} color={colors.blue_12} />
              </div>
            )}
            <div className={styles.form}>
              <CircuitInputs
                proofType={proofType}
                formValues={formValues}
                setFormValues={setFormValues}
                setFormHandler={setFormHandler}
                formErrors={formErrors}
                setFormErrors={setFormErrors}
                presetVals={query.presetVals}
                credential={credential}
                proofAction={query.proofAction}
                usePrfsRegistry={query.usePrfsRegistry}
                handleSkipCreateProof={handleSkipCreateProof}
              />
            </div>
            {systemMsg && <div className={styles.systemMsg}>{systemMsg}</div>}
            {errorMsg && <div className={cn(styles.systemMsg, styles.red)}>{errorMsg}</div>}
          </div>
        </div>
      </QueryItem>
    </>
  ) : (
    <div className={styles.overlayPlaceholder}>
      <Overlay>
        <Spinner size={18} color={colors.blue_12} />
      </Overlay>
    </div>
  );
};

export default CreateProof;

export interface CreateProofProps {
  credential: PrfsIdCredential;
  query: CreateProofQuery;
  setReceipt: React.Dispatch<React.SetStateAction<ProofGenReceiptRaw | null>>;
  handleSkip: (record: Record<string, any>) => void;
}

export interface LoadDriverProgressProps {
  progress: Record<string, any> | null;
}
