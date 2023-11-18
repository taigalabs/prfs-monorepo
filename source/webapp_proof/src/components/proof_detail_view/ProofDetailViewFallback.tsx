import React, { Suspense } from "react";
import { BiLinkExternal } from "@react-icons/all-files/bi/BiLinkExternal";

import styles from "./ProofDetailView.module.scss";
import ProofTypeMasthead from "@/components/masthead/ProofTypeMasthead";
import { getI18N } from "@/i18n/getI18N";
import ProofTypeMastheadFallback from "../masthead/ProofTypeMastheadFallback";

const ProofDetailView: React.FC<ProofDetailViewProps> = async ({ proofInstanceId }) => {
  const i18n = await getI18N();

  return (
    <>
      <Suspense fallback={<ProofTypeMastheadFallback />}>
        <ProofTypeMasthead
          proofInstanceId={proofInstanceId}
          proofType={undefined}
          handleSelectProofType={() => { }}
        />
      </Suspense>
      <div className={styles.wrapper}>
        <div className={styles.meta}>
          <div className={styles.upperRow}>
            <a className={styles.consoleLink}>
              <p>{i18n.view_in_console}</p>
              <BiLinkExternal />
            </a>
          </div>
          <div className={styles.bannerContainer}>{i18n.proof_banner}</div>
          <ul>
            <li>{/* <SocialSharePopover /> */}</li>
          </ul>
          <div className={styles.proofDetailContainer}>
            <div>
              <div className={styles.content}></div>
            </div>
          </div>
        </div>
        <div className={styles.proofDetail}>
          <div className={styles.verifyProofFormWrapper}>{i18n.verify_proof_form}</div>
        </div>
      </div>
    </>
  );
};

export default ProofDetailView;

export interface ProofDetailViewProps {
  proofInstanceId: string;
}
