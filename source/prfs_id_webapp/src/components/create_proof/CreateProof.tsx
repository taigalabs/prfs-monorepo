"use client";

import React from "react";
import { CreateProofEvent } from "@taigalabs/prfs-driver-interface";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import cn from "classnames";
import colors from "@taigalabs/prfs-react-lib/src/colors.module.scss";
import { useMutation, useQuery } from "@taigalabs/prfs-react-lib/react_query";
import { prfsApi3 } from "@taigalabs/prfs-api-js";
import { CreateProofQuery, PrfsIdCredential, TutorialArgs } from "@taigalabs/prfs-id-sdk-web";
import { TbNumbers } from "@taigalabs/prfs-react-lib/src/tabler_icons/TbNumbers";
import TutorialStepper from "@taigalabs/prfs-react-lib/src/tutorial/TutorialStepper";
import Overlay from "@taigalabs/prfs-react-lib/src/overlay/Overlay";

import styles from "./CreateProof.module.scss";
import { i18nContext } from "@/i18n/context";
import { validateInputs } from "./validate_inputs";
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
import { LoadDriverStatus, useLoadDriver } from "@/components/load_driver/useLoadDriver";
import LoadDriver from "@/components/load_driver/LoadDriver";
import { FormHandler, FormValues } from "@/components/circuit_input_items/formTypes";

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

const CreateProof: React.FC<CreateProofProps> = ({
  credential,
  query,
  setReceipt,
  tutorial,
  setErrorDialogMsg,
  handleSkip,
}) => {
  const i18n = React.useContext(i18nContext);
  const [systemMsg, setSystemMsg] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<React.ReactNode | null>(null);
  const [createProofStatus, setCreateProofStatus] = React.useState(Status.Standby);
  const [formHandler, setFormHandler] = React.useState<(() => FormHandler) | null>(null);
  const [formValues, setFormValues] = React.useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  const tutorialStep = useAppSelector(state => state.tutorial.tutorialStep);
  const { data, error } = useProofType(query?.proofTypeId);
  const handleProofGenEvent = React.useCallback((ev: CreateProofEvent) => {
    const { payload } = ev;
    setSystemMsg(payload.payload);
  }, []);
  const { loadDriverProgress, loadDriverStatus, driver, driverArtifacts } = useLoadDriver(
    data?.payload?.prfs_proof_type,
  );

  React.useEffect(() => {
    if (error) {
      setErrorDialogMsg(
        <p>
          <span>Error fetching proof type, something is wrong. </span>
          <span>{error.toString()}</span>
        </p>,
      );
    }

    if (data?.error) {
      setErrorDialogMsg(
        <p>
          <span>Error fetching proof type, something is wrong. </span>
          <span>{data.error.toString()}</span>
        </p>,
      );
    }
  }, [data, error, setErrorDialogMsg]);

  React.useEffect(() => {
    const { name } = query;

    setReceipt(oldVals => ({
      ...oldVals,
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

        if (!formHandler) {
          return;
        }

        // try {
        //   // const isValid = await validateInputs(formValues, proofType, setFormErrors);
        //   // if (!isValid) {
        //   //   throw new Error("Input validation fail to create a proof");
        //   // }
        //   //
        //   const isValid = await formHandler(formValues);
        //   if (!isValid) {
        //     throw new Error("Input validation fail to create a proof");
        //   }

        //   console.log("Form values", formValues);
        //   setCreateProofStatus(Status.InProgress);
        //   const proveReceipt = await driver.prove({
        //     inputs: formValues,
        //     circuitTypeId: proofType.circuit_type_id,
        //     eventListener: handleProofGenEvent,
        //   });

        //   setCreateProofStatus(Status.Standby);
        //   proveReceipt.proof.proofBytes = Array.from(proveReceipt.proof.proofBytes);
        //   return proveReceipt;
        // } catch (err: any) {
        //   setCreateProofStatus(Status.Standby);
        //   // setSystemMsg(err.toString());
        //   throw err;
        // }
      },
    }));
  }, [formValues, setReceipt, query, driver, credential, formHandler]);

  const proofType = data?.payload?.prfs_proof_type;
  return proofType ? (
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
        <div className={styles.wrapper}>
          <div className={styles.moduleWrapper}>
            {loadDriverStatus === LoadDriverStatus.InProgress && (
              <div className={styles.overlay}>
                <Spinner size={24} color={colors.blue_12} />
              </div>
            )}
            <TutorialStepper
              tutorialId={tutorial ? tutorial.tutorialId : null}
              step={tutorialStep}
              steps={[2]}
            >
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
                  handleSkip={handleSkip}
                />
              </div>
            </TutorialStepper>
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
  setErrorDialogMsg: React.Dispatch<React.SetStateAction<React.ReactNode>>;
  setReceipt: React.Dispatch<React.SetStateAction<ProofGenReceiptRaw | null>>;
  tutorial: TutorialArgs | undefined;
  handleSkip: (proofId: string) => void;
}

export interface LoadDriverProgressProps {
  progress: Record<string, any> | null;
}
