// import { envs } from "@/envs";
// import { CircuitDriver, ProveReceipt } from "@taigalabs/prfs-driver-interface";
// import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
// import { ProofGenElement } from "@taigalabs/prfs-sdk-web";
// import React from "react";

// const Temp: React.FC<TempProps> = ({
//   proofType,
//   handleCreateProofResult,
//   proofGenElement,
//   setProofGenElement,
// }) => {
//   const driverRef = React.useRef(false);
//   React.useEffect(() => {
//     async function fn() {
//       if (!driverRef.current) {
//         driverRef.current = true;
//         const { circuit_driver_id, driver_properties } = proofType;

//         const driverProperties = interpolateSystemAssetEndpoint(
//           driver_properties,
//           `${envs.NEXT_PUBLIC_PRFS_ASSET_SERVER_ENDPOINT}/assets/circuits`,
//         );

//         console.log(555, circuit_driver_id, driverProperties);

//         // const elem = (await prfsSDK.create("proof_gen", {
//         //   proofTypeId: proofType.proof_type_id,
//         //   circuit_driver_id,
//         //   driver_properties,
//         //   sdkEndpoint: process.env.NEXT_PUBLIC_PRFS_SDK_WEB_ENDPOINT,
//         // })) as ProofGenElement;

//         const mod = await import("@taigalabs/prfs-driver-spartan-js");
//         const driver = await mod.default.newInstance(driverProperties as any, ev => {
//           console.log("ev", ev);
//         });

//         console.log(11, driver);

//         // elem.subscribe((ev: ProofGenEvent) => {
//         //   const { type, payload } = ev;

//         //   if (type === "LOAD_DRIVER_EVENT") {
//         //     if (payload.asset_label && payload.progress) {
//         //       setLoadDriverProgress(oldVal => ({
//         //         ...oldVal,
//         //         [payload.asset_label!]: payload.progress,
//         //       }));
//         //     }
//         //   }

//         //   if (type === "LOAD_DRIVER_SUCCESS") {
//         //     const now = dayjs();
//         //     const diff = now.diff(since, "seconds", true);
//         //     const { artifactCount } = payload;

//         //     setDriverMsg(
//         //       <>
//         //         <span>Circuit driver </span>
//         //         <a
//         //           href={`${envs.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT}/circuit_drivers/${circuit_driver_id}`}
//         //         >
//         //           {proofType.circuit_driver_id} <BiLinkExternal />
//         //         </a>
//         //         <span>
//         //           ({diff} seconds, {artifactCount} artifacts)
//         //         </span>
//         //       </>,
//         //     );
//         //     setLoadDriverStatus(LoadDriverStatus.Standby);
//         //   }

//         //   if (type === "CREATE_PROOF_EVENT") {
//         //     setSystemMsg(payload.payload);
//         //   }
//         // });
//       }
//     }

//     fn().then();
//   }, [proofType, setProofGenElement]);

//   return null;
// };

// export default Temp;

// export interface TempProps {
//   proofType: PrfsProofType;
//   handleCreateProofResult: (err: any, proveReceipt: ProveReceipt | null) => void;
//   proofGenElement: ProofGenElement | null;
//   setProofGenElement: React.Dispatch<React.SetStateAction<ProofGenElement | null>>;
// }

// export function interpolateSystemAssetEndpoint(
//   driverProperties: Record<string, any>,
//   prfsAssetEndpoint: string,
// ): Record<string, any> {
//   const ret: Record<string, any> = {};

//   for (const key in driverProperties) {
//     const val = driverProperties[key];
//     ret[key] = val.replace("prfs://", `${prfsAssetEndpoint}/`);
//   }

//   return ret;
// }
