import React from "react";
import Link from "next/link";
import QRCode from "qrcode";
import { useRouter } from "next/navigation";
import { PrfsProofInstanceSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofInstanceSyn1";

import styles from "./ProofInstanceQRCode.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";

const ProofInstanceQRCode: React.FC<ProofInstanceQRCodeProps> = ({ proofInstance }) => {
  const i18n = React.useContext(i18nContext);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    async function fn() {
      if (canvasRef.current && proofInstance) {
        const url = `${process.env.NEXT_PUBLIC_PRFS_WEB_ENDPOINT}/${paths.proof__proof_instances}/${proofInstance.proof_instance_id}`;

        await QRCode.toCanvas(canvasRef.current, url, {
          errorCorrectionLevel: "H",
          width: 120,
        });
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
