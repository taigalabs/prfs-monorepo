"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { Msg, MsgType, sendMsgToParent } from "@taigalabs/prfs-sdk-web";
import NoSSR from "@taigalabs/prfs-react-components/src/no_ssr/NoSSR";

import styles from "./ProofGen.module.scss";
import { i18nContext } from "@/contexts/i18n";
import CreateProofForm from "@/components/create_proof_form/CreateProofForm";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import { checkSanity } from "@/functions/sanity";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import { useMutation } from "@tanstack/react-query";
import { GetPrfsProofTypeByProofTypeIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsProofTypeByProofTypeIdRequest";
import { delay } from "@/functions/interval";

const BASE_HEIGHT = 49;
const HEIGHT_PER_INPUT = 58;

const ProofGen: React.FC<ProofGenProps> = () => {
  const i18n = React.useContext(i18nContext);

  const searchParams = useSearchParams();
  const [proofType, setProofType] = React.useState<PrfsProofType>();
  // const [docHeight, setDocHeight] = React.useState<number>(320);
  // const [docWidth, setDocWidth] = React.useState<number>(484);

  const { mutateAsync: getPrfsProofTypeByProofTypeIdRequest } = useMutation({
    mutationFn: (req: GetPrfsProofTypeByProofTypeIdRequest) => {
      return prfsApi2("get_prfs_proof_type_by_proof_type_id", req);
    },
  });

  React.useEffect(() => {
    checkSanity();

    async function fn() {
      const proofTypeId = searchParams.get("proofTypeId");
      // const theme = searchParams.get("theme") || "light";
      // const docWidth = Number(searchParams.get("docWidth"));
      // document.documentElement.setAttribute("data-theme", theme);

      // if (proofTypeId) {
      //   try {
      //     const { payload } = await getPrfsProofTypeByProofTypeIdRequest({
      //       proof_type_id: proofTypeId,
      //     });

      //     if (payload.prfs_proof_type) {
      //       const proof_type = payload.prfs_proof_type;
      //       // const circuitInputCount = Object.keys(proof_type.circuit_inputs).length;
      //       // const docHeight = calcFormHeight(proof_type.circuit_inputs as CircuitInput[]);

      //       await sendMsgToParent(
      //         new Msg("HANDSHAKE", {
      //           // docHeight,
      //         })
      //       );

      //       // setDocHeight(docHeight);
      //       // setDocWidth(docWidth);
      //       setProofType(proof_type);
      //     } else {
      //       console.log("PrfsProofType not found");
      //     }
      //   } catch (err) {
      //     console.error(err);
      //   }
      // }

      // const { circuit_driver_id, driver_properties } = proofType;
      // const driverProperties = interpolateSystemAssetEndpoint(
      //   driver_properties,
      //   ASSET_SERVER_ENDPOINT
      // );

      // try {
      //   const driver = await initDriver(circuit_driver_id, driverProperties);
      //   setSystemMsg(`${circuit_driver_id}`);
      //   setDriver(driver);
      // } catch (err) {
      //   setSystemMsg(`Driver init failed, id: ${circuit_driver_id}, err: ${err}`);
      // }
    }

    fn().then();
  }, [searchParams, setProofType]);

  return (
    proofType && (
      <NoSSR>
        <DefaultLayout>
          <div className={styles.wrapper}></div>
          {/* <CreateProofForm proofType={proofType} /> */}
        </DefaultLayout>
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
