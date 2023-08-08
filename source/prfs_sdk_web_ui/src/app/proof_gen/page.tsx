"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import * as prfsApi from "@taigalabs/prfs-api-js";

import styles from "./Home.module.scss";
import { i18nContext } from "@/contexts/i18n";
import CreateProofForm from "@/components/create_proof_form/CreateProofForm";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import { MsgType } from "@taigalabs/prfs-sdk-web";

const PARENT_MSG_HANDLER = {
  registered: false,
};

const ProofGen: React.FC<ProofGenProps> = ({ params }) => {
  const i18n = React.useContext(i18nContext);

  const [data, setData] = React.useState();
  const searchParams = useSearchParams();
  const [proofType, setProofType] = React.useState<PrfsProofType>();

  useMessageHandler(setData);

  React.useEffect(() => {
    window.parent.postMessage(
      {
        type: MsgType.HANDSHAKE,
      },
      "*"
    );
  }, []);

  React.useEffect(() => {
    async function fn() {
      let proofTypeId = searchParams.get("proofTypeId");
      console.log("proofTypeId: %s", proofTypeId);

      if (proofTypeId) {
        const { payload } = await prfsApi.getPrfsProofTypes({
          page: 0,
          proof_type_id: proofTypeId,
        });

        if (payload.prfs_proof_types.length > 0) {
          setProofType(payload.prfs_proof_types[0]);
        } else {
          console.log("PrfsProofType not found");
        }
      }
    }

    fn().then();
  }, [searchParams, setProofType]);

  return <DefaultLayout>{proofType && <CreateProofForm proofType={proofType} />}</DefaultLayout>;
};

export default ProofGen;

export interface ProofGenProps {
  params: {
    proofTypeId: string;
  };
}

function useMessageHandler(setData) {
  React.useEffect(() => {
    if (!PARENT_MSG_HANDLER.registered) {
      console.log("Attaching parent msg handler");

      window.addEventListener("message", e => {
        console.log("parent says", e.data);

        const type: MsgType = e.data;

        switch (type) {
          case MsgType.GET_SIGNER_RESPONSE:
            window.postMessage({});
            break;

          default:
          // console.error(`Cannot handle this msg type, type: ${type}`);
        }
      });

      PARENT_MSG_HANDLER.registered = true;
    }
  }, []);
}
