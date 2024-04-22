"use client";

import React from "react";
import cn from "classnames";
import ProofBanner from "@taigalabs/prfs-react-lib/src/proof_banner/ProofBanner";
import SocialSharePopover from "@taigalabs/prfs-react-lib/src/social_share_popover/SocialSharePopover";
import SaveProofPopover from "@taigalabs/prfs-react-lib/src/save_proof_popover/SaveProofPopover";
import { prfsApi3 } from "@taigalabs/prfs-api-js";
import { useQuery } from "@taigalabs/prfs-react-lib/react_query";
import ProofDataView from "@taigalabs/prfs-react-lib/src/proof_data_view/ProofDataView";
import { Proof } from "@taigalabs/prfs-driver-interface";

import styles from "./ProofDetailView.module.scss";
import { i18nContext } from "@/i18n/context";
import { envs } from "@/envs";
import ProofTypeSelectedMasthead from "@/components/proof_type_selected_masthead/ProofTypeSelectedMasthead";
import { useSelectProofType } from "@/hooks/proofType";
import LeftPadding from "@/components/left_padding/LeftPadding";
import { MastheadPlaceholder } from "@/components/masthead/MastheadComponents";
import Loading from "@/components/loading/Loading";

function useGetPrfsProof(prfsProofId: string) {
  return useQuery({
    queryKey: ["get_prfs_proof_by_proof_id", prfsProofId],
    queryFn: async () => {
      return prfsApi3({
        type: "get_prfs_proof_by_proof_id",
        prfs_proof_id: prfsProofId,
      });
    },
  });
}

const ProofDetailView: React.FC<ProofDetailViewProps> = ({ prfsProofId }) => {
  const i18n = React.useContext(i18nContext);
  const handleSelectProofType = useSelectProofType();
  const { isPending, data, error } = useGetPrfsProof(prfsProofId);
  const [payloadError, setPayloadError] = React.useState<React.ReactNode>(null);

  const proof = React.useMemo(() => {
    if (data && data.payload) {
      const { payload, error } = data;
      const { prfs_proof } = payload;

      if (error) {
        setPayloadError(error);
        return null;
      }

      const proof: Proof = {
        proofBytes: new Uint8Array(prfs_proof.proof),
        publicInputSer: prfs_proof.public_inputs,
        proofPubKey: prfs_proof.public_key,
      };

      return proof;
    }

    return null;
  }, [data, setPayloadError]);

  const proofUrl = React.useMemo(() => {
    return `${envs.NEXT_PUBLIC_PRFS_PROOF_WEBAPP_ENDPOINT}/p/${prfsProofId}`;
  }, [data]);

  const prfsProof = data?.payload?.prfs_proof;

  return isPending ? (
    <Loading />
  ) : (
    <>
      <ProofTypeSelectedMasthead
        isActivated
        prfsProofId={prfsProofId}
        proofType={null}
        handleSelectProofType={handleSelectProofType}
      />
      <MastheadPlaceholder twoColumn />
      <div className={styles.topRow}>
        <LeftPadding />
        <div className={styles.content}>
          <div className={styles.mainMenu}>
            <ul className={styles.leftMenu}>
              <li>
                <SocialSharePopover />
              </li>
              <li>{prfsProof && <SaveProofPopover prfsProof={prfsProof} />}</li>
            </ul>
          </div>
          <div className={styles.rightPadding} />
        </div>
      </div>
      <div className={cn(styles.main)}>
        <LeftPadding />
        <div className={styles.content}>
          <div className={styles.meta}>
            <div className={styles.bannerContainer}>
              {prfsProof && <ProofBanner prfsProof={prfsProof} proofUrl={proofUrl} />}
            </div>
            <div className={styles.proofDetailContainer}></div>
          </div>
          <div className={styles.proofDataContainer}>
            {proof && <ProofDataView proof={proof} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProofDetailView;

export interface ProofDetailViewProps {
  prfsProofId: string;
}
