"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import * as prfsApi from "@taigalabs/prfs-api-js";
import { HandshakeMsg, MsgType, sendMsgToParent } from "@taigalabs/prfs-sdk-web";
import NoSSR from "@taigalabs/prfs-react-components/src/no_ssr/NoSSR";

import styles from "./ProofGen.module.scss";
import { i18nContext } from "@/contexts/i18n";
import CreateProofForm from "@/components/create_proof_form/CreateProofForm";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import Loading from "@/components/loading/Loading";
import { checkSanity } from "@/functions/sanity";

const BASE_HEIGHT = 100;
const HEIGHT_PER_INPUT = 61;

const ProofGen: React.FC<ProofGenProps> = () => {
  const i18n = React.useContext(i18nContext);

  const [data, setData] = React.useState();
  const searchParams = useSearchParams();
  const [proofType, setProofType] = React.useState<PrfsProofType>();
  const [docHeight, setDocHeight] = React.useState<number>();

  React.useEffect(() => {
    checkSanity();

    async function fn() {
      let proofTypeId = searchParams.get("proofTypeId");
      console.log("proofTypeId: %s", proofTypeId);

      if (proofTypeId) {
        let payload;
        try {
          payload = (
            await prfsApi.getPrfsProofTypeByProofTypeId({
              proof_type_id: proofTypeId,
            })
          ).payload;
        } catch (err) {
          return;
        }

        if (payload.prfs_proof_type) {
          const proof_type = payload.prfs_proof_type;
          const circuitInputCount = Object.keys(proof_type.circuit_inputs).length;
          const docHeight = calcFormHeight(circuitInputCount);
          // console.log("docHeight", docHeight);

          await sendMsgToParent(
            new HandshakeMsg({
              docHeight,
            })
          );

          setDocHeight(docHeight);
          setProofType(proof_type);
        } else {
          console.log("PrfsProofType not found");
        }
      }
    }

    fn().then();
  }, [searchParams, setProofType, setDocHeight]);

  return (
    proofType &&
    docHeight && (
      <NoSSR>
        <DefaultLayout>
          <CreateProofForm proofType={proofType} docHeight={docHeight} />
        </DefaultLayout>
      </NoSSR>
    )
  );
};

export default ProofGen;

export interface ProofGenProps {}

function calcFormHeight(inputCount: number): number {
  return inputCount * HEIGHT_PER_INPUT + BASE_HEIGHT;
}
