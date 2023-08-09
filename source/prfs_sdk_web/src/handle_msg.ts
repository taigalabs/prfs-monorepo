import { CircuitDriver } from "@taigalabs/prfs-driver-interface";
import { ethers } from "ethers";

import { CreateProofPayload, GetAddressResponseMsg, HandshakeResponseMsg, MsgType } from "./msg";

export function handleChildMessage(
  iframe: HTMLIFrameElement,
  resolve: (value: any) => void,
  provider: ethers.providers.Web3Provider
) {
  console.log("attaching child msg handler");

  window.addEventListener("message", async (ev: MessageEvent) => {
    if (ev.ports.length > 0) {
      const type: MsgType = ev.data.type;

      console.log("child says, data: %o, ports: %o", ev.data, ev.ports);

      switch (type) {
        case "HANDSHAKE": {
          ev.ports[0].postMessage(new HandshakeResponseMsg("hello"));

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
          const driver = await initDriver(payload.driverId, payload.driverProperties);

          console.log("Proving...");
          console.time("Full proving time");
          const prevTime = performance.now();

          const { proof, publicInput } = await driver.prove(
            payload.sig,
            payload.msgHash,
            payload.merkleProof
          );
          const now = performance.now();
          const diff = now - prevTime;

          console.log(`Created a proof, ${diff}`);

          break;
        }

        default:
          console.error(`[parent] invalid msg type, ${type}`);
      }
    }

    // const msgType: MsgType = e.data.type;

    // switch (msgType) {
    //   case MsgType.HANDSHAKE: {
    //     iframe.contentWindow?.postMessage(
    //       {
    //         type: MsgType.HANDSHAKE_RESPONSE,
    //       },
    //       "*"
    //     );
    //     resolve(iframe);
    //   }
    //   default: {
    //   }
    // }
  });
}

async function initDriver(
  driverId: string,
  driverProps: Record<string, any>
): Promise<CircuitDriver> {
  switch (driverId) {
    case "SPARTAN_CIRCOM_1": {
      const mod = await import("@taigalabs/prfs-driver-spartan-js");
      const driver = await mod.default.newInstance(driverProps);
      return driver;
    }
    default:
      throw new Error(`This driver is not supported, ${driverId}`);
  }
}
