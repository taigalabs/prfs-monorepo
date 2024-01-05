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
} from "@taigalabs/prfs-id-sdk-web";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { encrypt } from "@taigalabs/prfs-crypto-js";
import { PrfsIdentitySignInRequest } from "@taigalabs/prfs-entities/bindings/PrfsIdentitySignInRequest";
import { useQuery } from "@tanstack/react-query";
import { idApi, prfsApi2 } from "@taigalabs/prfs-api-js";
import { useMutation } from "@tanstack/react-query";
import { delay } from "@taigalabs/prfs-react-lib/src/hooks/interval";

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
import { QueryItemList } from "@/components/default_module/QueryItem";
import { initCircuitDriver, interpolateSystemAssetEndpoint } from "@taigalabs/prfs-proof-gen-js";
import ProofView from "./ProofView";
import { envs } from "@/envs";
import { CircuitDriver } from "@taigalabs/prfs-driver-interface";
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
  const [status, setStatus] = React.useState(Status.InProgress);
  const [verifyProofStatus, setVerifyProofStatus] = React.useState(Status.Standby);
  const [driver, setDriver] = React.useState<CircuitDriver | null>(null);
  const [errorMsg, setErrorMsg] = React.useState("");
  const { data } = useProofType(verifyProofArgs?.proof_type_id);

  React.useEffect(() => {
    async function fn() {
      if (data) {
        const { payload, error } = data;
        if (payload) {
          const proofType = payload.prfs_proof_type;

          const driverProps = interpolateSystemAssetEndpoint(
            proofType.driver_properties,
            `${envs.NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT}/assets/circuits`,
          );
          // setLoadDriverStatus(Status.InProgress);
          const driver = await initCircuitDriver(
            proofType.circuit_driver_id,
            driverProps,
            handleDriverEv,
          );
          setDriver(driver);
        } else {
          console.error("payload doesn't exist", error);
        }
      }
    }
    fn().then();
  }, []);

  const handleClickSubmit = React.useCallback(async () => {
    if (verifyProofArgs && prfsEmbed && status === Status.Standby && data) {
      // if (!receipt) {
      //   setErrorMsg("no proof gen receipt");
      //   return;
      // }
      // setStatus(Status.InProgress);
      // await delay(500);
      // const processedReceipt = await processReceipt(receipt);
      // const payload: ProofGenSuccessPayload = {
      //   receipt: processedReceipt,
      // };
      // const encrypted = JSON.stringify(
      //   encrypt(proofGenArgs.public_key, Buffer.from(JSON.stringify(payload))),
      // );
      // console.log("receipt: %o, encrypted", processedReceipt, encrypted);
      // try {
      //   await sendMsgToChild(
      //     newPrfsIdMsg("PROOF_GEN_RESULT", {
      //       appId: proofGenArgs.app_id,
      //       key: proofGenArgs.public_key,
      //       value: encrypted,
      //     }),
      //     prfsEmbed,
      //   );
      // } catch (err: any) {
      //   await sendMsgToChild(newPrfsIdErrorMsg("PROOF_GEN_RESULT", err.toString()), prfsEmbed);
      //   console.error(err);
      // }
      // setStatus(Status.Standby);
      // window.close();
    }
  }, [searchParams, verifyProofArgs, setErrorMsg, setStatus, data]);

  return verifyProofArgs ? (
    <>
      <DefaultInnerPadding noSidePadding>
        {status === Status.InProgress ||
          (verifyProofStatus === Status.InProgress && <div className={styles.overlay} />)}
        <DefaultModuleHeader noTopPadding className={styles.sidePadding}>
          <DefaultModuleTitle>
            You want to verify a proof at{" "}
            <span className={styles.blueText}>{verifyProofArgs.app_id}</span>
          </DefaultModuleTitle>
        </DefaultModuleHeader>
        {/* <div className={cn(styles.prfsId, styles.sidePadding)}> */}
        {/*   <p>{credential.id}</p> */}
        {/* </div> */}
        <QueryItemList sidePadding>
          <ProofView
            tutorial={verifyProofArgs.tutorial}
            proofType={data?.payload?.prfs_proof_type}
          />
          {/* <CreateProof */}
          {/*   key={query.name} */}
          {/*   credential={credential} */}
          {/*   query={query} */}
          {/*   setReceipt={setReceipt} */}
          {/*   tutorial={proofGenArgs.tutorial} */}
          {/* /> */}
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
