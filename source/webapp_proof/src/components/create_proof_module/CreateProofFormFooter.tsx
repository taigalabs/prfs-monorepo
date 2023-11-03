import React from "react";
import Fade from "@taigalabs/prfs-react-components/src/fade/Fade";
import cn from "classnames";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { ProveReceipt } from "@taigalabs/prfs-driver-interface";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { useMutation } from "@tanstack/react-query";
import { GetPrfsProofTypeByProofTypeIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsProofTypeByProofTypeIdRequest";
import ProofGenElement from "@taigalabs/prfs-sdk-web/src/proof_gen_element/proof_gen_element";

import styles from "./CreateProofFormFooter.module.scss";
import { i18nContext } from "@/contexts/i18n";
import CreateProofModule from "@/components/create_proof_module/CreateProofModule";
import { paths } from "@/paths";
import ProofTypeMasthead from "../masthead/ProofTypeMasthead";

const CreateProofFormFooter: React.FC<CreateProofFormFooterProps> = ({ children }) => {
  const i18n = React.useContext(i18nContext);
  const [proofType, setProofType] = React.useState<PrfsProofType>();
  const [proveReceipt, setProveReceipt] = React.useState<ProveReceipt>();
  const [proofGenElement, setProofGenElement] = React.useState<ProofGenElement | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>{children}</div>
    </div>
  );
};

export default CreateProofFormFooter;

export interface CreateProofFormFooterProps {
  children: React.ReactNode;
}
