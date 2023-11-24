"use client";

import React from "react";
import { PrfsProofInstanceSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofInstanceSyn1";
import cn from "classnames";
import JSONBig from "json-bigint";
import ProofBanner from "@taigalabs/prfs-react-components/src/proof_banner/ProofBanner";
import SocialSharePopover from "@taigalabs/prfs-react-components/src/social_share_popover/SocialSharePopover";
import SaveProofPopover from "@taigalabs/prfs-react-components/src/save_proof_popover/SaveProofPopover";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { useMutation } from "wagmi";
import { GetPrfsProofInstanceByInstanceIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsProofInstanceByInstanceIdRequest";
import { Proof } from "@taigalabs/prfs-driver-interface";
import { BiLinkExternal } from "@react-icons/all-files/bi/BiLinkExternal";

import styles from "./ProofDetailView.module.scss";
import { i18nContext } from "@/contexts/i18n";
import ProofDataView from "@/components/proof_data_view/ProofDataView";
import { envs } from "@/envs";
import TutorialStepper from "@/components/tutorial/TutorialStepper";
import ProofTypeMasthead from "@/components/masthead/ProofTypeMasthead";
import { useSelectProofType } from "@/hooks/proofType";
import Tutorial from "@/components/tutorial/Tutorial";
import { useIsTutorial } from "@/hooks/tutorial";
import TutorialPlaceholder from "@/components/tutorial/TutorialPlaceholder";
import LeftPadding from "../left_padding/LeftPadding";

const JSONbigNative = JSONBig({
  useNativeBigInt: true,
  alwaysParseAsBig: true,
  storeAsString: true,
});

const ProofDetailView: React.FC<ProofDetailViewProps> = ({ proofInstanceId }) => {
  const i18n = React.useContext(i18nContext);
  const [proofInstance, setProofInstance] = React.useState<PrfsProofInstanceSyn1>();

  const { mutateAsync: getPrfsProofInstanceByInstanceIdRequest } = useMutation({
    mutationFn: (req: GetPrfsProofInstanceByInstanceIdRequest) => {
      return prfsApi2("get_prfs_proof_instance_by_instance_id", req);
    },
  });

  const handleSelectProofType = useSelectProofType();

  const isTutorial = useIsTutorial();

  React.useEffect(() => {
    async function fn() {
      const proof_instance_id = decodeURIComponent(proofInstanceId);
      try {
        const { payload } = await getPrfsProofInstanceByInstanceIdRequest({
          proof_instance_id,
        });

        setProofInstance(payload.prfs_proof_instance_syn1);
      } catch (err) {
        console.error("Proof instance is not found, invalid access");
      }
    }

    fn().then();
  }, [setProofInstance, getPrfsProofInstanceByInstanceIdRequest]);

  const ret = React.useMemo(() => {
    if (proofInstance) {
      const consoleUrl = `${envs.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT}/proof_instances/${proofInstance.proof_instance_id}`;

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

  if (ret === null || !proofInstance) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.isLoading}>Loading...</div>
      </div>
    );
  }

  const { consoleUrl, proof } = ret;

  return (
    <>
      <ProofTypeMasthead
        isActivated
        proofInstanceId={proofInstanceId}
        proofType={undefined}
        handleSelectProofType={handleSelectProofType}
      />
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
              <li>
                <a className={styles.link} href={consoleUrl}>
                  <p>{i18n.view_in_console}</p>
                  <BiLinkExternal />
                </a>
              </li>
            </ul>
          </div>
          <div className={styles.rightPadding} />
        </div>
      </div>
      <div className={cn(styles.main, { [styles.isTutorial]: isTutorial })}>
        <LeftPadding />
        <div className={styles.content}>
          <div className={styles.meta}>
            <div className={styles.bannerContainer}>
              <TutorialStepper steps={[5]}>
                <ProofBanner
                  proofInstance={proofInstance}
                  webappProofEndpoint={envs.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}
                />
              </TutorialStepper>
            </div>
            <div className={styles.proofDetailContainer}>
              <div>
                <div className={styles.content}>
                  <p className={styles.label}>{proofInstance.proof_label}</p>
                  <p className={styles.desc}>{proofInstance.proof_desc}</p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.proofDataContainer}>
            <ProofDataView proof={proof} circuitDriverId={proofInstance.circuit_driver_id} />
          </div>
        </div>
      </div>
      <Tutorial bigTopMargin variant="w1502" />
      <TutorialPlaceholder variant="h1502" />
    </>
  );
};

export default ProofDetailView;

export interface ProofDetailViewProps {
  proofInstanceId: string;
}
