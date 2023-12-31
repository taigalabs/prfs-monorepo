import React from "react";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import { ProveReceipt } from "@taigalabs/prfs-driver-interface";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import Spinner from "@taigalabs/prfs-react-components/src/spinner/Spinner";
import LoaderBar from "@taigalabs/prfs-react-components/src/loader_bar/LoaderBar";
import { PrfsSDK } from "@taigalabs/prfs-sdk-web";
import dayjs from "dayjs";
import cn from "classnames";
import { useSearchParams } from "next/navigation";
import { BiLinkExternal } from "@react-icons/all-files/bi/BiLinkExternal";
import { ProofGenElement } from "@taigalabs/prfs-sdk-web";
import colors from "@taigalabs/prfs-react-components/src/colors.module.scss";
import { IoMdAdd } from "@react-icons/all-files/io/IoMdAdd";
// import { ProofGenEvent } from "@taigalabs/prfs-sdk-web/src/elems/proof_gen/types";
import { ProofGenArgs, makeProofGenSearchParams } from "@taigalabs/prfs-id-sdk-web/proof_gen";

import styles from "./CreateProofModule.module.scss";
import { i18nContext } from "@/i18n/context";
import { validateInputs } from "@/functions/validate_inputs";
import TutorialStepper from "@/components/tutorial/TutorialStepper";
import ProofTypeMeta from "@/components/proof_type_meta/ProofTypeMeta";
import { envs } from "@/envs";
import CircuitInputs from "./CircuitInputs";
import { useRandomKeyPair } from "@/hooks/key";
import { API_PATH } from "@taigalabs/prfs-id-sdk-web";

const prfsSDK = new PrfsSDK("prfs-proof");

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

const CreateProofModule: React.FC<CreateProofModuleProps> = ({
  proofType,
  handleCreateProofResult,
  proofGenElement,
  setProofGenElement,
}) => {
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
  const { sk, pkHex } = useRandomKeyPair();

  const isTutorial = React.useMemo(() => {
    if (searchParams.get("tutorial_id")) {
      return true;
    }
    return false;
  }, [searchParams]);

  const handleClickCreateProof = React.useCallback(async () => {
    const args: ProofGenArgs = {
      nonce: Math.random() * 100000000,
      appId: "prfs_proof",
      proofTypeId: proofType.proof_type_id,
      publicKey: pkHex,
    };

    const searchParams = makeProofGenSearchParams(args);
    const endpoint = `${envs.NEXT_PUBLIC_PRFS_ID_WEBAPP_ENDPOINT}${API_PATH.proof_gen}${searchParams}`;
    const child = window.open(endpoint, "_blank", "toolbar=0,location=0,menubar=0");

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
    proofType,
    handleCreateProofResult,
    proofGenElement,
    setSystemMsg,
    createProofStatus,
  ]);

  React.useEffect(() => {
    async function fn() {
      if (lastInitProofTypeId.current && lastInitProofTypeId.current === proofType.proof_type_id) {
        return;
      }
      lastInitProofTypeId.current = proofType.proof_type_id;

      const { circuit_driver_id, driver_properties } = proofType;
      setLoadDriverStatus(LoadDriverStatus.InProgress);
      setDriverMsg(<span>Loading driver {proofType.circuit_driver_id}...</span>);

      const since = dayjs();
      //   try {
      //     const elem = (await prfsSDK.create("proof_gen", {
      //       proofTypeId: proofType.proof_type_id,
      //       circuit_driver_id,
      //       driver_properties,
      //       sdkEndpoint: process.env.NEXT_PUBLIC_PRFS_SDK_WEB_ENDPOINT,
      //     })) as ProofGenElement;

      //     elem.subscribe((ev: ProofGenEvent) => {
      //       const { type, payload } = ev;

      //       if (type === "LOAD_DRIVER_EVENT") {
      //         if (payload.asset_label && payload.progress) {
      //           setLoadDriverProgress(oldVal => ({
      //             ...oldVal,
      //             [payload.asset_label!]: payload.progress,
      //           }));
      //         }
      //       }

      //       if (type === "LOAD_DRIVER_SUCCESS") {
      //         const now = dayjs();
      //         const diff = now.diff(since, "seconds", true);
      //         const { artifactCount } = payload;

      //         setDriverMsg(
      //           <>
      //             <span>Circuit driver </span>
      //             <a
      //               href={`${envs.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT}/circuit_drivers/${circuit_driver_id}`}
      //             >
      //               {proofType.circuit_driver_id} <BiLinkExternal />
      //             </a>
      //             <span>
      //               ({diff} seconds, {artifactCount} artifacts)
      //             </span>
      //           </>,
      //         );
      //         setLoadDriverStatus(LoadDriverStatus.Standby);
      //       }

      //       if (type === "CREATE_PROOF_EVENT") {
      //         setSystemMsg(payload.payload);
      //       }
      //     });

      //     setProofGenElement(elem);
      //     return elem;
      //   } catch (err) {
      //     setDriverMsg(`Driver init failed, id: ${circuit_driver_id}, err: ${err}`);
      //   }
    }

    fn().then();
  }, [
    proofType,
    setProofGenElement,
    setCreateProofStatus,
    setLoadDriverProgress,
    setLoadDriverStatus,
    setSystemMsg,
    setDriverMsg,
  ]);

  return (
    <div className={cn(styles.wrapper, { [styles.isTutorial]: isTutorial })}>
      <div className={styles.driverMsg}>
        {/* <div className={styles.msg}>{driverMsg}</div> */}
        {/* {loadDriverStatus === LoadDriverStatus.InProgress && ( */}
        {/*   <LoadDriverProgress progress={loadDriverProgress} /> */}
        {/* )} */}
      </div>
      <div className={cn(styles.main, { [styles.isTutorial]: isTutorial })}>
        <div className={styles.moduleArea}>
          <div className={styles.moduleWrapper}>
            {/* {loadDriverStatus === LoadDriverStatus.InProgress || */}
            {/*   (createProofStatus === CreateProofStatus.InProgress && ( */}
            {/*     <div className={styles.loaderBarWrapper}> */}
            {/*       <LoaderBar /> */}
            {/*     </div> */}
            {/*   ))} */}
            {/* {loadDriverStatus === LoadDriverStatus.InProgress && ( */}
            {/*   <div className={styles.overlay}> */}
            {/*     <Spinner size={32} color={colors.blue_12} /> */}
            {/*   </div> */}
            {/* )} */}
            {/* <TutorialStepper steps={[2]}> */}
            {/*   <div className={styles.form}> */}
            {/*     <CircuitInputs */}
            {/*       circuitInputs={proofType.circuit_inputs as CircuitInput[]} */}
            {/*       proofGenElement={proofGenElement} */}
            {/*       formValues={formValues} */}
            {/*       setFormValues={setFormValues} */}
            {/*       formErrors={formErrors} */}
            {/*       setFormErrors={setFormErrors} */}
            {/*     /> */}
            {/*   </div> */}
            {/* </TutorialStepper> */}
            <div className={styles.btnRow}>
              <button
                onClick={handleClickCreateProof}
                className={cn(styles.createBtn, {
                  [styles.inProgress]: createProofStatus === CreateProofStatus.InProgress,
                })}
              >
                <IoMdAdd />
                <span>{i18n.create_proof_with_prfs}</span>
              </button>
            </div>
            {/* {systemMsg && ( */}
            {/*   <div className={styles.footer}> */}
            {/*     <div */}
            {/*       className={cn(styles.msg, { */}
            {/*         [styles.errorMsg]: createProofStatus === CreateProofStatus.Error, */}
            {/*       })} */}
            {/*     > */}
            {/*       {systemMsg} */}
            {/*     </div> */}
            {/*   </div> */}
            {/* )} */}
          </div>
        </div>
        <div className={styles.metaArea}>
          <ProofTypeMeta
            proofTypeDesc={proofType.desc}
            proofTypeId={proofType.proof_type_id}
            imgUrl={proofType.img_url}
            proofTypeLabel={proofType.label}
            proofTypeAuthor={proofType.author}
            circuitTypeId={proofType.circuit_type_id}
            circuitDriverId={proofType.circuit_driver_id}
            proofTypeCreatedAt={proofType.created_at}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateProofModule;

export interface CreateProofModuleProps {
  proofType: PrfsProofType;
  handleCreateProofResult: (err: any, proveReceipt: ProveReceipt | null) => void;
  proofGenElement: ProofGenElement | null;
  setProofGenElement: React.Dispatch<React.SetStateAction<ProofGenElement | null>>;
}

export interface LoadDriverProgressProps {
  progress: Record<string, any>;
}
