"use client";

import React from "react";
import { PrfsProofInstanceSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofInstanceSyn1";
import cn from "classnames";
import { JSONbigNative } from "@taigalabs/prfs-crypto-js";
import ProofBanner from "@taigalabs/prfs-react-lib/src/proof_banner/ProofBanner";
import SocialSharePopover from "@taigalabs/prfs-react-lib/src/social_share_popover/SocialSharePopover";
import SaveProofPopover from "@taigalabs/prfs-react-lib/src/save_proof_popover/SaveProofPopover";
import { prfsApi3 } from "@taigalabs/prfs-api-js";
import { useMutation } from "@taigalabs/prfs-react-lib/react_query";
import { GetPrfsProofInstanceByInstanceIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsProofInstanceByInstanceIdRequest";
import ProofDataView from "@taigalabs/prfs-react-lib/src/proof_data_view/ProofDataView";
import { Proof } from "@taigalabs/prfs-driver-interface";

import styles from "./ProofDetailView.module.scss";
import { i18nContext } from "@/i18n/context";
import { envs } from "@/envs";
import ProofTypeSelectedMasthead from "@/components/proof_type_selected_masthead/ProofTypeSelectedMasthead";
import { useSelectProofType } from "@/hooks/proofType";
import LeftPadding from "@/components/left_padding/LeftPadding";
import { MastheadPlaceholder } from "@/components/masthead/MastheadComponents";

const ProofDetailView: React.FC<ProofDetailViewProps> = ({ prfsProofId }) => {
  const i18n = React.useContext(i18nContext);
  const [proofInstance, setProofInstance] = React.useState<PrfsProofInstanceSyn1>();
  const handleSelectProofType = useSelectProofType();

  const { mutateAsync: getPrfsProofInstanceByInstanceIdRequest } = useMutation({
    mutationFn: (req: GetPrfsProofInstanceByInstanceIdRequest) => {
      return prfsApi3({ type: "get_prfs_proof_instance_by_instance_id", ...req });
    },
  });

  React.useEffect(() => {
    async function fn() {
      // const proof_instance_id = decodeURIComponent(proofInstanceId);
      // try {
      //   const { payload } = await getPrfsProofInstanceByInstanceIdRequest({
      //     proof_instance_id,
      //   });
      //   if (payload) {
      //     setProofInstance(payload.prfs_proof_instance_syn1);
      //   }
      // } catch (err) {
      //   console.error("Proof instance is not found, invalid access");
      // }
    }

    fn().then();
  }, [setProofInstance, getPrfsProofInstanceByInstanceIdRequest]);

  const proofData = React.useMemo(() => {
    if (proofInstance) {
      const consoleUrl = `${envs.NEXT_PUBLIC_PRFS_CONSOLE_WEBAPP_ENDPOINT}\
/proof_instances/${proofInstance.proof_instance_id}`;

      const ret = {
        consoleUrl,
        proof: {
          proofBytes: new Uint8Array(proofInstance.proof),
          publicInputSer: JSONbigNative.stringify(proofInstance.public_inputs),
        } as Proof,
      };

      return ret;
    }

    return null;
  }, [proofInstance]);

  if (proofData === null || !proofInstance) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.isLoading}>Loading...</div>
      </div>
    );
  }

  const { proof } = proofData;

  return (
    <>
      <ProofTypeSelectedMasthead
        isActivated
        prfsProofId={prfsProofId}
        proofType={undefined}
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
              <li>
                <SaveProofPopover
                  proofInstance={proofInstance}
                  proofShortUrl={`${process.env.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}/p/${proofInstance.short_id}`}
                />
              </li>
            </ul>
            <ul>
              {/* <li> */}
              {/*   <a className={styles.link} href={consoleUrl}> */}
              {/*     <p>{i18n.view_in_console}</p> */}
              {/*     <BiLinkExternal /> */}
              {/*   </a> */}
              {/* </li> */}
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
              <ProofBanner
                proofInstance={proofInstance}
                webappProofEndpoint={envs.NEXT_PUBLIC_PRFS_PROOF_WEBAPP_ENDPOINT}
              />
            </div>
            <div className={styles.proofDetailContainer}></div>
          </div>
          <div className={styles.proofDataContainer}>
            <ProofDataView proof={proof} />
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
