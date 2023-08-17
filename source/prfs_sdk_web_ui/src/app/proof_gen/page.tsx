"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import * as prfsApi from "@taigalabs/prfs-api-js";
import { HandshakeMsg, MsgType, sendMsgToParent } from "@taigalabs/prfs-sdk-web";

import styles from "./ProofGen.module.scss";
import { i18nContext } from "@/contexts/i18n";
import CreateProofForm from "@/components/create_proof_form/CreateProofForm";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import Loading from "@/components/loading/Loading";
import NoSSR from "@/components/no_ssr/NoSSR";
import { checkSanity } from "@/functions/sanity";

const BASE_HEIGHT = 100;
const HEIGHT_PER_INPUT = 61;

const PARENT_MSG_HANDLER = {
  registered: false,
};

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
            await prfsApi.getPrfsProofTypes({
              page: 0,
              proof_type_id: proofTypeId,
            })
          ).payload;
        } catch (err) {
          return;
        }

        if (payload.prfs_proof_types.length > 0) {
          const proof_type = payload.prfs_proof_types[0];
          const circuitInputCount = Object.keys(proof_type.circuit_inputs).length;
          const docHeight = calcFormHeight(circuitInputCount);
          console.log("docHeight", docHeight);

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
