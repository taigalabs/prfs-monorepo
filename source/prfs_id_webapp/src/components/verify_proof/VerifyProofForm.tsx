import React from "react";
import cn from "classnames";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import { useSearchParams } from "next/navigation";
import {
  PrfsIdCredential,
  sendMsgToChild,
  newPrfsIdMsg,
  newPrfsIdErrorMsg,
  ProofGenArgs,
  QueryType,
  ProofGenSuccessPayload,
  VerifyProofArgs,
  VerifyProofResultPayload,
} from "@taigalabs/prfs-id-sdk-web";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { encrypt } from "@taigalabs/prfs-crypto-js";
import { PrfsIdentitySignInRequest } from "@taigalabs/prfs-entities/bindings/PrfsIdentitySignInRequest";
import { useQuery } from "@tanstack/react-query";
import { idApi, prfsApi2 } from "@taigalabs/prfs-api-js";
import { useMutation } from "@tanstack/react-query";
import { delay } from "@taigalabs/prfs-react-lib/src/hooks/interval";
import { CircuitDriver, Proof } from "@taigalabs/prfs-driver-interface";
import { initCircuitDriver, interpolateSystemAssetEndpoint } from "@taigalabs/prfs-proof-gen-js";

import styles from "./VerifyProofForm.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  DefaultErrorMsg,
  DefaultInnerPadding,
  DefaultModuleBtnRow,
  DefaultModuleHeader,
  DefaultModuleTitle,
} from "@/components/default_module/DefaultModule";
import CommitmentView from "@/components/commitment/CommitmentView";
import CreateProof from "@/components/create_proof/CreateProof";
import {
  QueryItem,
  QueryItemLeftCol,
  QueryItemList,
  QueryItemMeta,
  QueryItemRightCol,
  QueryName,
} from "@/components/default_module/QueryItem";
import ProofView from "./ProofView";
import { envs } from "@/envs";
import { LoadDriverStatus, useLoadDriver } from "@/components/load_driver/useLoadDriver";
import { TbNumbers } from "@taigalabs/prfs-react-lib/src/tabler_icons/TbNumbers";
import TutorialStepper from "@taigalabs/prfs-react-lib/src/tutorial/TutorialStepper";
import LoadDriver from "../load_driver/LoadDriver";
// import { ProofGenReceiptRaw, processReceipt } from "./receipt";

enum Status {
  InProgress,
  Standby,
}

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

const VerifyProofForm: React.FC<VerifyProofFormProps> = ({ verifyProofArgs, prfsEmbed }) => {
  const i18n = React.useContext(i18nContext);
  const searchParams = useSearchParams();
  // const [status, setStatus] = React.useState(Status.InProgress);
  const [verifyProofStatus, setVerifyProofStatus] = React.useState(Status.Standby);
  const [proof, setProof] = React.useState<Proof | null>(null);
  const [errorMsg, setErrorMsg] = React.useState("");
  const { data } = useProofType(verifyProofArgs?.proof_type_id);
  const { driver, driverArtifacts, loadDriverStatus, loadDriverProgress } = useLoadDriver(
    data?.payload?.prfs_proof_type,
  );

  React.useEffect(() => {
    async function fn() {
      if (prfsEmbed && verifyProofArgs) {
        const resp = await sendMsgToChild(
          newPrfsIdMsg("GET_MSG", {
            appId: verifyProofArgs?.app_id,
          }),
          prfsEmbed,
        );

        try {
          const payload: Proof = JSON.parse(resp);
          payload.proofBytes = new Uint8Array(payload.proofBytes);
          setProof(payload);
          console.log(11, payload);
        } catch (err) {
          console.error(err);
        }
      }
    }
    fn().then();
  }, [prfsEmbed, setProof]);

  const handleClickSubmit = React.useCallback(async () => {
    if (verifyProofArgs && prfsEmbed && proof && data && proofType && driver) {
      setVerifyProofStatus(Status.InProgress);
      await delay(500);
      const res = await driver.verify({
        proof,
        circuitTypeId: proofType?.circuit_type_id,
      });
      const payload: VerifyProofResultPayload = {
        result: res,
      };
      const encrypted = JSON.stringify(
        encrypt(verifyProofArgs.public_key, Buffer.from(JSON.stringify(payload))),
      );
      console.log("payload: %o, encrypted", payload, encrypted);

      try {
        await sendMsgToChild(
          newPrfsIdMsg("VERIFY_PROOF_RESULT", {
            appId: verifyProofArgs.app_id,
            // key: proofGenArgs.public_key,
            value: encrypted,
          }),
          prfsEmbed,
        );
      } catch (err: any) {
        await sendMsgToChild(newPrfsIdErrorMsg("VERIFY_PROOF_RESULT", err.toString()), prfsEmbed);
        console.error(err);
      }
      setVerifyProofStatus(Status.Standby);
      // window.close();
    }
  }, [searchParams, verifyProofArgs, setErrorMsg, data, setVerifyProofStatus, driver]);

  const proofType = data?.payload?.prfs_proof_type;
  const tutorial = verifyProofArgs?.tutorial;

  return verifyProofArgs ? (
    <>
      <DefaultInnerPadding noSidePadding>
        {(!proof || verifyProofStatus === Status.InProgress) && <div className={styles.overlay} />}
        <DefaultModuleHeader noTopPadding className={styles.sidePadding}>
          <DefaultModuleTitle>
            You want to verify a proof at{" "}
            <span className={styles.blueText}>{verifyProofArgs.app_id}</span>
          </DefaultModuleTitle>
        </DefaultModuleHeader>
        <QueryItemList sidePadding>
          {proofType && (
            <QueryItem sidePadding>
              <QueryItemMeta>
                <QueryItemLeftCol>
                  <TbNumbers />
                </QueryItemLeftCol>
                <QueryItemRightCol>
                  <QueryName
                    className={cn({ [styles.creating]: verifyProofStatus === Status.InProgress })}
                  >
                    <span>{i18n.proof}</span>
                    {verifyProofStatus === Status.InProgress && <span> (Verifying...)</span>}
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
                </QueryItemRightCol>
              </QueryItemMeta>
              <div className={styles.wrapper}>
                <div className={styles.moduleWrapper}>
                  {loadDriverStatus === LoadDriverStatus.InProgress && (
                    <div className={styles.overlay}>
                      <Spinner size={24} />
                    </div>
                  )}
                  <TutorialStepper
                    tutorialId={tutorial ? tutorial.tutorialId : null}
                    step={tutorial ? tutorial.step : null}
                    steps={[2]}
                  >
                    <div className={styles.form}>
                      {/* <CircuitInputs */}
                      {/*   circuitInputs={proofType.circuit_inputs as CircuitInput[]} */}
                      {/*   formValues={formValues} */}
                      {/*   setFormValues={setFormValues} */}
                      {/*   formErrors={formErrors} */}
                      {/*   setFormErrors={setFormErrors} */}
                      {/*   presetVals={query.presetVals} */}
                      {/*   credential={credential} */}
                      {/* /> */}
                    </div>
                  </TutorialStepper>
                </div>
              </div>
            </QueryItem>
          )}
        </QueryItemList>
        {/* <div className={cn(styles.dataWarning, styles.sidePadding)}> */}
        {/*   <p className={styles.title}>Make sure you trust {verifyProofArgs.app_id} app</p> */}
        {/*   <p className={styles.desc}>{i18n.app_data_sharing_guide}</p> */}
        {/* </div> */}
        <DefaultModuleBtnRow className={cn(styles.btnRow, styles.sidePadding)}>
          {/* <Button variant="transparent_blue_2" noTransition handleClick={handleClickPrev}> */}
          {/*   {i18n.go_back} */}
          {/* </Button> */}
          <Button
            type="button"
            variant="blue_2"
            className={styles.signInBtn}
            contentClassName={styles.signInBtnContent}
            noTransition
            handleClick={handleClickSubmit}
            noShadow
          >
            <span>{i18n.submit}</span>
            {verifyProofStatus === Status.InProgress && <Spinner size={16} />}
          </Button>
        </DefaultModuleBtnRow>
        <DefaultErrorMsg className={styles.sidePadding}>{errorMsg}</DefaultErrorMsg>
      </DefaultInnerPadding>
    </>
  ) : (
    <div className={styles.loading}>Loading...</div>
  );
};

export default VerifyProofForm;

export interface VerifyProofFormProps {
  // credential: PrfsIdCredential;
  verifyProofArgs: VerifyProofArgs | null;
  prfsEmbed: HTMLIFrameElement | null;
}
