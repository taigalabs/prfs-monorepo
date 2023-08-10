import { Component, Show, createEffect, createResource, createSignal, useContext } from "solid-js";
import * as prfsApi from "@taigalabs/prfs-api-js";
import { MsgType, sendMsgToParent } from "@taigalabs/prfs-sdk-web";
import { useSearchParams, Params } from "@solidjs/router";

import styles from "./ProofGen.module.scss";
import { I18nContext } from "@/contexts/i18n";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import CreateProofForm from "@/components/create_proof_form/CreateProofForm";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import Loading from "@/components/loading/Loading";

const PARENT_MSG_HANDLER = {
  registered: false,
};

const ProofGen: Component<ProofGenProps> = () => {
  const i18n = useContext(I18nContext);

  const [data, setData] = createSignal(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [proofType] = createResource(searchParams, fetchProofType);

  // const [count, setCount] = createSignal(0);

  useParentMsgHandler();

  createEffect(() => {
    async function fn() {
      const reply = await sendMsgToParent({
        type: MsgType.HANDSHAKE,
        payload: "Hi",
      });

      console.log("parents reply", reply);
    }

    fn().then();
  });

  createEffect(() => {
    async function fn() {
      let proofTypeId = searchParams["proofTypeId"];
      console.log("proofTypeId: %s", proofTypeId);

      if (proofTypeId) {
        // setProofTypeId(proofTypeId);
        // const resp = await prfsApi.getPrfsProofTypes({
        //   page: 0,
        //   proof_type_id: proofTypeId,
        // });
        // if (resp && resp.payload.prfs_proof_types.length > 0) {
        //   console.log(555, resp.payload.prfs_proof_types[0]);
        //   setProofType(resp.payload.prfs_proof_types[0]);
        // } else {
        //   console.log("PrfsProofType not found");
        // }
      }
    }

    fn().then();
  });

  // console.log(33, proofType());
  console.log(331, data());

  return (
    <DefaultLayout>
      <Show when={proofType()} fallback={<Loading />}>
        <CreateProofForm proofType={proofType()!} />
      </Show>
    </DefaultLayout>
  );
};

export default ProofGen;

export interface ProofGenProps {
  // params: {
  //   proofTypeId: string;
  // };
}

function useParentMsgHandler() {
  createEffect(() => {
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
  });
}

async function fetchProofType(searchParams: Params) {
  let proofTypeId = searchParams["proofTypeId"];
  console.log("proofTypeId: %s", proofTypeId);

  if (proofTypeId) {
    const resp = await prfsApi.getPrfsProofTypes({
      page: 0,
      proof_type_id: proofTypeId,
    });

    if (resp && resp.payload.prfs_proof_types.length > 0) {
      return resp.payload.prfs_proof_types[0];
    } else {
      console.log("PrfsProofType not found");
    }
  }
}
