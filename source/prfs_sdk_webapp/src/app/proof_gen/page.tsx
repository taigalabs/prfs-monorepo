"use client";

import React from "react";

import { i18nContext } from "@/contexts/i18n";
import { useProofGen } from "./useProofGen";

const ProofGen: React.FC<ProofGenProps> = () => {
  const proofGen = useProofGen();

  // React.useEffect(() => {
  //   checkSanity();

  //   async function fn() {
  //     // const proofTypeId = searchParams.get("proofTypeId");
  //     // const theme = searchParams.get("theme") || "light";
  //     // const docWidth = Number(searchParams.get("docWidth"));
  //     // document.documentElement.setAttribute("data-theme", theme);
  //     // if (proofTypeId) {
  //     //   try {
  //     //     const { payload } = await getPrfsProofTypeByProofTypeIdRequest({
  //     //       proof_type_id: proofTypeId,
  //     //     });
  //     //     if (payload.prfs_proof_type) {
  //     //       const proof_type = payload.prfs_proof_type;
  //     //       // const circuitInputCount = Object.keys(proof_type.circuit_inputs).length;
  //     //       // const docHeight = calcFormHeight(proof_type.circuit_inputs as CircuitInput[]);
  //     //       await sendMsgToParent(
  //     //         new Msg("HANDSHAKE", {
  //     //           // docHeight,
  //     //         })
  //     //       );
  //     //       // setDocHeight(docHeight);
  //     //       // setDocWidth(docWidth);
  //     //       setProofType(proof_type);
  //     //     } else {
  //     //       console.log("PrfsProofType not found");
  //     //     }
  //     //   } catch (err) {
  //     //     console.error(err);
  //     //   }
  //     // }
  //     // const { circuit_driver_id, driver_properties } = proofType;
  //     // const driverProperties = interpolateSystemAssetEndpoint(
  //     //   driver_properties,
  //     //   ASSET_SERVER_ENDPOINT
  //     // );
  //     // try {
  //     //   const driver = await initDriver(circuit_driver_id, driverProperties);
  //     //   setSystemMsg(`${circuit_driver_id}`);
  //     //   setDriver(driver);
  //     // } catch (err) {
  //     //   setSystemMsg(`Driver init failed, id: ${circuit_driver_id}, err: ${err}`);
  //     // }
  //   }

  //   fn().then();
  // }, [searchParams, setProofType]);

  return null;
};

export default ProofGen;

export interface ProofGenProps {}
