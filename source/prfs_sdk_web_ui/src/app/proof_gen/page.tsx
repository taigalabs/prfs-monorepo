"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import * as prfsApi from "@taigalabs/prfs-api-js";
import { HandshakeMsg, MsgType, sendMsgToParent } from "@taigalabs/prfs-sdk-web";

import styles from "./Home.module.scss";
import { i18nContext } from "@/contexts/i18n";
import CreateProofForm from "@/components/create_proof_form/CreateProofForm";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import Loading from "@/components/loading/Loading";

const PARENT_MSG_HANDLER = {
  registered: false,
};

const ProofGen: React.FC<ProofGenProps> = ({ params }) => {
  const i18n = React.useContext(i18nContext);

  const [data, setData] = React.useState();
  const [prfsAssetEndpoint, setPrfsAssetEndpoint] = React.useState<string>();
  const searchParams = useSearchParams();
  const [proofType, setProofType] = React.useState<PrfsProofType>();

  useParentMsgHandler();

  React.useEffect(() => {
    async function fn() {
      const { prfsAssetEndpoint } = await sendMsgToParent(new HandshakeMsg("hi"));
      setPrfsAssetEndpoint(prfsAssetEndpoint);
    }
    fn().then();
  }, [setPrfsAssetEndpoint]);

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

  return (
    <DefaultLayout>
      {proofType && prfsAssetEndpoint ? (
        <CreateProofForm proofType={proofType} prfsAssetEndpoint={prfsAssetEndpoint} />
      ) : (
        <Loading />
      )}
    </DefaultLayout>
  );
};

export default ProofGen;

export interface ProofGenProps {
  params: {
    proofTypeId: string;
  };
}

function useParentMsgHandler() {
  React.useEffect(() => {
    if (!PARENT_MSG_HANDLER.registered) {
      console.log("Attaching parent msg handler");

      window.addEventListener("message", (ev: MessageEvent) => {
        if (ev.ports.length > 0) {
          console.log("parent says: %o, ports: %o", ev.data, ev.ports);

          const type: MsgType = ev.data.type;
          ev.ports[0].postMessage({ result: `${ev.data} back` });
        }

        // console.log(44, ports);

        // switch (type) {
        //   case MsgType.GET_SIGNER_RESPONSE:
        //     window.postMessage({});
        //     break;

        //   default:
        //   // console.error(`Cannot handle this msg type, type: ${type}`);
        // }
      });

      PARENT_MSG_HANDLER.registered = true;
    }
  }, []);
}
