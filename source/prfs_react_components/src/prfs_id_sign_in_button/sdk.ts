import React from "react";
import dayjs from "dayjs";
import { PrfsSDK } from "@taigalabs/prfs-sdk-web";
// import UtilsElement from "@taigalabs/prfs-sdk-web/src/elems/default/element";

const prfsSDK = new PrfsSDK("prfs-proof");
const sdkEndpoint = process.env.NEXT_PUBLIC_PRFS_SDK_WEB_ENDPOINT;

// export function useSDKElem() {
//   const elemRef = React.useRef<UtilsElement | null>(null);

//   React.useEffect(() => {
//     async function fn() {
//       if (elemRef.current || !sdkEndpoint) {
//         return;
//       }

//       // const { circuit_driver_id, driver_properties } = proofType;
//       // setLoadDriverStatus(LoadDriverStatus.InProgress);
//       // setDriverMsg(<span>Loading driver {proofType.circuit_driver_id}...</span>);

//       const since = dayjs();
//       try {
//         const elem = await prfsSDK.create("utils", {
//           sdkEndpoint,
//         });

//         elem.subscribe(ev => {
//           const { type, payload } = ev;

//           console.log(111, ev);

//           // if (type === "LOAD_DRIVER_EVENT") {
//           //   if (payload.asset_label && payload.progress) {
//           //     setLoadDriverProgress(oldVal => ({
//           //       ...oldVal,
//           //       [payload.asset_label!]: payload.progress,
//           //     }));
//           //   }
//           // }

//           // if (type === "LOAD_DRIVER_SUCCESS") {
//           //   const now = dayjs();
//           //   const diff = now.diff(since, "seconds", true);
//           //   const { artifactCount } = payload;

//           //   setDriverMsg(
//           //     <>
//           //       <span>Circuit driver </span>
//           //       <a
//           //         href={`${envs.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT}/circuit_drivers/${circuit_driver_id}`}
//           //       >
//           //         {proofType.circuit_driver_id} <BiLinkExternal />
//           //       </a>
//           //       <span>
//           //         ({diff} seconds, {artifactCount} artifacts)
//           //       </span>
//           //     </>,
//           //   );
//           //   setLoadDriverStatus(LoadDriverStatus.Standby);
//           // }

//           // if (type === "CREATE_PROOF_EVENT") {
//           //   setSystemMsg(payload.payload);
//           // }
//         });

//         // setProofGenElement(elem);
//         elemRef.current = elem;
//         return elem;
//       } catch (err) {
//         // setDriverMsg(`Driver init failed, id: ${circuit_driver_id}, err: ${err}`);
//       }
//     }

//     fn().then();
//   }, []);
// }
