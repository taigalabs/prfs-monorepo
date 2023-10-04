"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { Msg, sendMsgToParent } from "@taigalabs/prfs-sdk-web";
import NoSSR from "@taigalabs/prfs-react-components/src/no_ssr/NoSSR";

import styles from "./ZAuthPage.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { checkSanity } from "@/functions/sanity";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import ZAuthLayout from "@/layouts/zauth_layout/ZAuthLayout";
import CreateProofModule from "@/components/create_proof_module/CreateProofModule";

const BASE_HEIGHT = 59;
const HEIGHT_PER_INPUT = 58;

const ProofGen: React.FC<ProofGenProps> = () => {
  const i18n = React.useContext(i18nContext);

  const searchParams = useSearchParams();
  const [proofType, setProofType] = React.useState<PrfsProofType>();
  const [docHeight, setDocHeight] = React.useState<number>(320);
  const [docWidth, setDocWidth] = React.useState<number>(484);

  React.useEffect(() => {
    checkSanity();

    async function fn() {
      const proofTypeId = searchParams.get("proofTypeId");
      const theme = searchParams.get("theme") || "light";
      const docWidth = Number(searchParams.get("docWidth"));
      document.documentElement.setAttribute("data-theme", theme);

      if (proofTypeId) {
        try {
          const { payload } = await prfsApi2("get_prfs_proof_type_by_proof_type_id", {
            proof_type_id: proofTypeId,
          });

          if (payload.prfs_proof_type) {
            const proof_type = payload.prfs_proof_type;
            const docHeight = calcFormHeight(proof_type.circuit_inputs as CircuitInput[]);

            await sendMsgToParent(
              new Msg("HANDSHAKE", {
                docHeight,
              })
            );

            setDocHeight(docHeight);
            setDocWidth(docWidth);
            setProofType(proof_type);
          } else {
            console.log("PrfsProofType not found");
          }
        } catch (err) {
          console.error(err);
        }
      }
    }

    fn().then();
  }, [searchParams, setProofType, setDocHeight, setDocWidth]);

  return (
    proofType &&
    docHeight && (
      <NoSSR>
        <ZAuthLayout>
          <div className={styles.wrapper}></div>
          <CreateProofModule proofType={proofType} handleCreateProof={() => {}} />
        </ZAuthLayout>
      </NoSSR>
    )
  );
};

export default ProofGen;

export interface ProofGenProps {}

function calcFormHeight(circuit_inputs: CircuitInput[]): number {
  let unitCount = 0;
  for (const input of circuit_inputs) {
    unitCount += input.units;
  }

  return unitCount * HEIGHT_PER_INPUT + BASE_HEIGHT;
}
