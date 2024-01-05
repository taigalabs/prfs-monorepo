"use client";

import React from "react";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import { CircuitDriver, CreateProofEvent, DriverEvent } from "@taigalabs/prfs-driver-interface";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import dayjs from "dayjs";
import cn from "classnames";
import { BiLinkExternal } from "@react-icons/all-files/bi/BiLinkExternal";
import colors from "@taigalabs/prfs-react-lib/src/colors.module.scss";
import { useQuery } from "@tanstack/react-query";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { initCircuitDriver, interpolateSystemAssetEndpoint } from "@taigalabs/prfs-proof-gen-js";
import { CreateProofQuery, PrfsIdCredential, TutorialArgs } from "@taigalabs/prfs-id-sdk-web";
import { TbNumbers } from "@taigalabs/prfs-react-lib/src/tabler_icons/TbNumbers";
import TutorialStepper from "@taigalabs/prfs-react-lib/src/tutorial/TutorialStepper";

import styles from "./ProofView.module.scss";
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
import { useAppSelector } from "@/state/hooks";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";

enum Status {
  Standby,
  InProgress,
}

const ProofView: React.FC<ProofViewProps> = ({ tutorial, proofType }) => {
  const i18n = React.useContext(i18nContext);

  return null;

  // return (
  //   proofType && (
  //     <>
  //       <QueryItem sidePadding>
  //         <QueryItemMeta>
  //           <QueryItemLeftCol>
  //             <TbNumbers />
  //           </QueryItemLeftCol>
  //           <QueryItemRightCol>
  //             <QueryName
  //               className={cn({ [styles.creating]: createProofStatus === Status.InProgress })}
  //             >
  //               {/* <span>{query.name}</span> */}
  //               {createProofStatus === Status.InProgress && <span> (Creating...)</span>}
  //             </QueryName>
  //             <div>{proofType.proof_type_id}</div>
  //             <div className={styles.driverMsg}>
  //               {driverMsg}
  //               {loadDriverStatus === Status.InProgress && (
  //                 <LoadDriverProgress progress={loadDriverProgress} />
  //               )}
  //             </div>
  //           </QueryItemRightCol>
  //         </QueryItemMeta>
  //         <div className={styles.wrapper}>
  //           <div className={styles.moduleWrapper}>
  //             {loadDriverStatus === Status.InProgress && (
  //               <div className={styles.overlay}>
  //                 <Spinner size={32} color={colors.blue_12} />
  //               </div>
  //             )}
  //             <TutorialStepper
  //               tutorialId={tutorial ? tutorial.tutorialId : null}
  //               step={tutorialStep}
  //               steps={[2]}
  //             >
  //               <div className={styles.form}>
  //                 {/* <CircuitInputs */}
  //                 {/*   circuitInputs={proofType.circuit_inputs as CircuitInput[]} */}
  //                 {/*   formValues={formValues} */}
  //                 {/*   setFormValues={setFormValues} */}
  //                 {/*   formErrors={formErrors} */}
  //                 {/*   setFormErrors={setFormErrors} */}
  //                 {/*   presetVals={query.presetVals} */}
  //                 {/*   credential={credential} */}
  //                 {/* /> */}
  //               </div>
  //             </TutorialStepper>
  //           </div>
  //         </div>
  //       </QueryItem>
  //     </>
  //   )
  // );
};

export default ProofView;

export interface ProofViewProps {
  // credential: PrfsIdCredential;
  // query: CreateProofQuery;
  // setReceipt: React.Dispatch<React.SetStateAction<ProofGenReceiptRaw | null>>;
  tutorial: TutorialArgs | undefined;
  proofType: PrfsProofType;
}

export interface LoadDriverProgressProps {
  progress: Record<string, any> | null;
}
