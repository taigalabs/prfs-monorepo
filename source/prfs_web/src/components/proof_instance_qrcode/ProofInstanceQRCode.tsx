import React from "react";
import Link from "next/link";
import QRCode from "qrcode";
import { useRouter } from "next/navigation";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";

import styles from "./ProofInstanceDetailTable.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { PrfsProofInstance } from "@taigalabs/prfs-entities/bindings/PrfsProofInstance";
import Table, { TableBody, TableHeader, TableRecordData, TableRow } from "../table/Table";

const ProofInstanceQRCode: React.FC<ProofInstanceQRCodeProps> = ({ proofInstance }) => {
  const i18n = React.useContext(i18nContext);

  React.useEffect(() => {
    QRCode.toString("I am a pony!", { type: "terminal" }, function (_, url) {
      console.log(33, url);
    });
  }, []);

  return <div></div>;
};

export default ProofInstanceQRCode;

export interface ProofInstanceQRCodeProps {
  proofInstance: PrfsProofInstance | undefined;
}
