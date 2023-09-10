import React from "react";
import QRCode from "qrcode";
import { PrfsProofInstanceSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofInstanceSyn1";

import styles from "./ProofInstanceQRCode.module.scss";
// import { paths } from "@/paths";
// import { envs } from "@/envs";

const ProofInstanceQRCode: React.FC<ProofInstanceQRCodeProps> = ({ proofInstance }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    async function fn() {
      if (canvasRef.current && proofInstance) {
        // const url = `${envs.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT}/${paths.proof_instances}/${proofInstance.proof_instance_id}`;
        // await QRCode.toCanvas(canvasRef.current, url, {
        //   errorCorrectionLevel: "H",
        //   width: 104,
        // });
      }
    }
    fn().then();
  }, [canvasRef]);

  return (
    <div className={styles.wrapper}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default ProofInstanceQRCode;

export interface ProofInstanceQRCodeProps {
  proofInstance: PrfsProofInstanceSyn1;
}
