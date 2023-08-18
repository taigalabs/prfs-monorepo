import React from "react";
import Link from "next/link";
import QRCode from "qrcode";
import { useRouter } from "next/navigation";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";

import styles from "./ProofInstanceQRCode.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { PrfsProofInstance } from "@taigalabs/prfs-entities/bindings/PrfsProofInstance";
import Table, { TableBody, TableHeader, TableRecordData, TableRow } from "../table/Table";

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
  proofInstance: PrfsProofInstance | undefined;
}
