import React from "react";
import cn from "classnames";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import Overlay from "@taigalabs/prfs-react-lib/src/overlay/Overlay";
import { VerifyProofArgs, VerifyProofResultPayload } from "@taigalabs/prfs-id-sdk-web";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { encrypt } from "@taigalabs/prfs-crypto-js";
import { useQuery } from "@tanstack/react-query";
import { idSessionApi, prfsApi2, prfsApi3 } from "@taigalabs/prfs-api-js";
import { delay } from "@taigalabs/prfs-react-lib/src/hooks/interval";
import { Proof } from "@taigalabs/prfs-driver-interface";
import { TbNumbers } from "@taigalabs/prfs-react-lib/src/tabler_icons/TbNumbers";
import colors from "@taigalabs/prfs-react-lib/src/colors.module.scss";

import styles from "./VerifyProofForm.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  DefaultErrorMsg,
  DefaultInnerPadding,
  DefaultModuleBtnRow,
  DefaultModuleHeader,
  DefaultModuleTitle,
} from "@/components/default_module/DefaultModule";
import {
  QueryItem,
  QueryItemLeftCol,
  QueryItemList,
  QueryItemMeta,
  QueryItemRightCol,
  QueryName,
} from "@/components/default_module/QueryItem";
import { LoadDriverStatus, useLoadDriver } from "@/components/load_driver/useLoadDriver";
import LoadDriver from "@/components/load_driver/LoadDriver";
import { toUtf8String } from "ethers/lib/utils";
import { usePutSessionValue } from "@/hooks/session";

enum Status {
  InProgress,
  Standby,
}

function useProofType(proofTypeId: string | undefined) {
  return useQuery({
    queryKey: ["get_prfs_proof_type_by_proof_type_id", proofTypeId],
    queryFn: () => {
      if (proofTypeId) {
        // return prfsApi2("get_prfs_proof_type_by_proof_type_id", { proof_type_id: proofTypeId });
        return prfsApi3({
          type: "get_prfs_proof_type_by_proof_type_id",
          proof_type_id: proofTypeId,
        });
      }
    },
  });
}

export function useSessionValue(session_key: string | undefined) {
  return useQuery({
    queryKey: ["get_prfs_id_session_value", session_key],
    queryFn: async () => {
      if (session_key) {
        return idSessionApi({
          type: "get_prfs_id_session_value",
          key: session_key,
        });
      }
    },
  });
}

const ProofData: React.FC<ProofDataProps> = ({ proof }) => {
  const i18n = React.useContext(i18nContext);
  const res = React.useMemo(() => {
    if (proof) {
      const { proofBytes, publicInputSer } = proof;
      const arr = proofBytes.slice(0, 64);
      const raw = `${arr.join(",")}...`;
      return {
        raw,
        publicInput: publicInputSer,
      };
    } else {
      return null;
    }
  }, [proof]);

  if (!res) {
    return <div>Loading...</div>;
  }
  return (
    <div className={styles.proofData}>
      <div className={styles.raw}>
        <p className={styles.label}>
          {i18n.proof_raw} <span>({res.raw.length} bytes)</span>
        </p>
        <p>{res.raw}</p>
      </div>
      <div className={styles.publicInput}>
        <p className={styles.label}>{i18n.public_inputs}</p>
        <p>{res.publicInput}</p>
      </div>
    </div>
  );
};

const VerifyProofForm: React.FC<VerifyProofFormProps> = ({ verifyProofArgs }) => {
  const i18n = React.useContext(i18nContext);
  const [verifyProofStatus, setVerifyProofStatus] = React.useState(Status.Standby);
  const [proof, setProof] = React.useState<Proof | null>(null);
  const [errorMsg, setErrorMsg] = React.useState("");
  const { data } = useProofType(verifyProofArgs?.proof_type_id);
  const { driver, driverArtifacts, loadDriverStatus, loadDriverProgress } = useLoadDriver(
    data?.payload?.prfs_proof_type,
  );
  const { data: sessionValueData } = useSessionValue(verifyProofArgs?.session_key);
  const { mutateAsync: putSessionValueRequest } = usePutSessionValue();

  React.useEffect(() => {
    async function fn() {
      if (verifyProofArgs && sessionValueData) {
        const { session_key } = verifyProofArgs;
        const { payload } = sessionValueData;
        if (!payload) {
          console.error(
            "Session retrieval api didn't work. Something is wrong. key: %s",
            session_key,
          );
          return;
        }

        const { session } = payload;
        if (!session) {
          console.error("Payload should have a session at this point. key: %s", session_key);
          return;
        }

        if (session.value.length === 0) {
          console.error("Payload should have a proof data at this point. key: %s", session_key);
          return;
        }

        const valueStr = toUtf8String(session.value);
        const proof: Proof = JSON.parse(valueStr);
        proof.proofBytes = new Uint8Array(proof.proofBytes);
        setProof(proof);
      }
    }
    fn().then();
  }, [setProof, sessionValueData]);

  const handleClickSubmit = React.useCallback(async () => {
    if (verifyProofArgs && proof && data && proofType && driver) {
      try {
        setVerifyProofStatus(Status.InProgress);
        await delay(500);
        const res = await driver.verify({
          proof,
          circuitTypeId: proofType?.circuit_type_id,
        });
        const payload: VerifyProofResultPayload = {
          result: res,
        };
        const encrypted = encrypt(verifyProofArgs.public_key, Buffer.from(JSON.stringify(payload)));
        console.log("payload: %o, encrypted", payload, encrypted);
        const { payload: putSessionResp } = await putSessionValueRequest({
          key: verifyProofArgs.session_key,
          value: [...encrypted],
          ticket: "TICKET",
        });

        if (!putSessionResp) {
          console.error(
            "Couldn't get put session response, session_key: %s",
            verifyProofArgs.session_key,
          );
        }
        window.close();
      } catch (err: any) {
        console.error(err);
      }
      setVerifyProofStatus(Status.Standby);
    }
  }, [verifyProofArgs, setErrorMsg, data, setVerifyProofStatus, driver, putSessionValueRequest]);

  const proofType = data?.payload?.prfs_proof_type;

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
          {loadDriverStatus === LoadDriverStatus.InProgress && (
            <Overlay>
              <Spinner size={28} color={colors.blue_12} />
            </Overlay>
          )}
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
                {proofType && (
                  <>
                    <div>{proofType.proof_type_id}</div>
                    <div className={styles.driverMsg}>
                      <LoadDriver
                        proofType={proofType}
                        loadDriverStatus={loadDriverStatus}
                        progress={loadDriverProgress}
                        driverArtifacts={driverArtifacts}
                      />
                    </div>
                  </>
                )}
                <ProofData proof={proof} />
              </QueryItemRightCol>
            </QueryItemMeta>
          </QueryItem>
        </QueryItemList>
        <DefaultModuleBtnRow className={cn(styles.btnRow, styles.sidePadding)}>
          <div />
          <Button
            type="button"
            variant="blue_2"
            className={styles.submitBtn}
            contentClassName={styles.submitBtnContent}
            noTransition
            handleClick={handleClickSubmit}
            noShadow
          >
            <span>{i18n.verify}</span>
            {verifyProofStatus === Status.InProgress && <Spinner size={14} />}
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
  verifyProofArgs: VerifyProofArgs | null;
}

export interface ProofDataProps {
  proof: Proof | null;
}
