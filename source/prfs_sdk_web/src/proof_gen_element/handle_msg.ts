import { CircuitDriver } from "@taigalabs/prfs-driver-interface";
import { ethers } from "ethers";

import {
  CreateProofPayload,
  CreateProofResponseMsg,
  GetAddressResponseMsg,
  HandshakeResponseMsg,
  MsgType,
} from "./msg";
import { ProofGenElementOptions } from "./proof_gen_element";

export function handleChildMessage(
  iframe: HTMLIFrameElement,
  resolve: (value: any) => void,
  options: ProofGenElementOptions
) {
  console.log("attaching child msg handler");

  window.addEventListener("message", async (ev: MessageEvent) => {
    if (ev.ports.length > 0) {
      const { provider } = options;

      const type: MsgType = ev.data.type;

      console.log("child says, data: %o, ports: %o", ev.data, ev.ports);

      switch (type) {
        case "HANDSHAKE": {
          ev.ports[0].postMessage(new HandshakeResponseMsg("hello"));

          resolve(1);

          break;
        }

        case "GET_ADDRESS": {
          await provider.send("eth_requestAccounts", []);
          const signer = provider.getSigner();
          const addr = await signer.getAddress();

          ev.ports[0].postMessage(new GetAddressResponseMsg(addr));

          break;
        }

        case "GET_SIGNATURE": {
          const msg = ev.data.payload;

          await provider.send("eth_requestAccounts", []);
          const signer = provider.getSigner();
          const sig = await signer.signMessage(msg);

          ev.ports[0].postMessage(new GetAddressResponseMsg(sig));

          break;
        }

        case "CREATE_PROOF": {
          const payload: CreateProofPayload = ev.data.payload;
          // const driver = await initDriver(payload.driverId, payload.driverProperties);

          // console.log("Proving...");

          // const { proof, publicInput } = await driver.prove(
          //   payload.sig,
          //   payload.msgHash,
          //   payload.merkleProof
          // );

          // ev.ports[0].postMessage(
          //   new CreateProofResponseMsg({
          //     proof,
          //     publicInput,
          //   })
          // );

          // console.log("Verifying...");

          // console.time("Verification time");
          // const result = await driver.verify(proof, publicInput.serialize());
          // console.timeEnd("Verification time");

          // if (result) {
          //   console.log("Successfully verified proof!");
          // } else {
          //   console.log("Failed to verify proof :(");
          // }

          break;
        }

        default:
          console.error(`[parent] invalid msg type, ${type}`);
      }
    }
  });
}
