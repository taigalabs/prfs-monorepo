import React from "react";
import Link from "next/link";
import QRCode from "qrcode";
import { useRouter } from "next/navigation";
import { PrfsProofInstance } from "@taigalabs/prfs-entities/bindings/PrfsProofInstance";
import { PrfsProofInstanceSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofInstanceSyn1";

import styles from "./ProofInstanceQRCode.module.scss";
import { i18nContext } from "@/contexts/i18n";

const ProofInstanceQRCode: React.FC<ProofInstanceQRCodeProps> = ({ proofInstance }) => {
  const i18n = React.useContext(i18nContext);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    async function fn() {
      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, "I am a pony!", {
          errorCorrectionLevel: "H",
          width: 180,
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
  proofInstance: PrfsProofInstanceSyn1 | undefined;
}
