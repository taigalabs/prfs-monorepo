"use client";

import React from "react";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import { PrfsProofInstanceSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofInstanceSyn1";
import { AiOutlineCopy } from "@react-icons/all-files/ai/AiOutlineCopy";
import JSONBig from "json-bigint";
import { PrfsSDK } from "@taigalabs/prfs-sdk-web";
import ProofBanner from "@taigalabs/prfs-react-components/src/proof_banner/ProofBanner";
import SocialSharePopover from "@taigalabs/prfs-react-components/src/social_share_popover/SocialSharePopover";
import { HiOutlineDesktopComputer } from "@react-icons/all-files/hi/HiOutlineDesktopComputer";
import Link from "next/link";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { useMutation } from "wagmi";
import { GetPrfsProofInstanceByInstanceIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsProofInstanceByInstanceIdRequest";
import { useRouter } from "next/navigation";
import { ProveResult } from "@taigalabs/prfs-driver-interface";
import { BiLinkExternal } from "@react-icons/all-files/bi/BiLinkExternal";

import styles from "./ProofDetailView.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import VerifyProofForm from "@/components/verify_proof_form/VerifyProofForm";
import ProofGenElement from "@taigalabs/prfs-sdk-web/src/proof_gen_element/proof_gen_element";
import { envs } from "@/envs";
import TutorialStepper from "@/components/tutorial/TutorialStepper";
import ProofTypeMasthead from "@/components/masthead/ProofTypeMasthead";
import { useSelectProofType } from "@/hooks/proofType";

const prfsSDK = new PrfsSDK("prfs-proof");

const JSONbigNative = JSONBig({
  useNativeBigInt: true,
  alwaysParseAsBig: true,
  storeAsString: true,
});

const ProofDetailView: React.FC<ProofDetailViewProps> = ({ proofInstanceId }) => {
  const i18n = React.useContext(i18nContext);
  const didTryInitialize = React.useRef(false);
  const [proofGenElement, setProofGenElement] = React.useState<ProofGenElement | null>(null);
  const [proofInstance, setProofInstance] = React.useState<PrfsProofInstanceSyn1>();
  const router = useRouter();

  const { mutateAsync: getPrfsProofInstanceByInstanceIdRequest } = useMutation({
    mutationFn: (req: GetPrfsProofInstanceByInstanceIdRequest) => {
      return prfsApi2("get_prfs_proof_instance_by_instance_id", req);
    },
  });

  const handleSelectProofType = useSelectProofType();

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
      const headerLabel = `${i18n.proof} ${proofInstance.proof_instance_id}`;
      const consoleUrl = `${envs.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT}/proof_instances/${proofInstance.proof_instance_id}`;

      const ret = {
        headerLabel,
        consoleUrl,
        proveResult: {
          proof: new Uint8Array(proofInstance.proof),
          publicInputSer: JSONbigNative.stringify(proofInstance.public_inputs),
        } as ProveResult,
      };

      return ret;
    }

    return null;
  }, [proofInstance]);

  // React.useEffect(() => {
  //   async function fn() {
  //     if (didTryInitialize.current) {
  //       return;
  //     }
  //     didTryInitialize.current = true;

  //     // const { circuit_driver_id, driver_properties } = proofInstance.circuit_driver_id;

  //     // try {
  //     //   const elem = await prfsSDK.create("proof-gen", {
  //     //     proofTypeId: proofType.proof_type_id,
  //     //     circuit_driver_id,
  //     //     driver_properties,
  //     //     sdkEndpoint: process.env.NEXT_PUBLIC_PRFS_SDK_WEB_ENDPOINT,
  //     //     proofGenEventListener: proofGenEventListener,
  //     //   });

  //     //   elem.subscribe(msg => {
  //     //     setSystemMsg(msg.data);
  //     //   });

  //     //   setProofGenElement(elem);
  //     //   return elem;
  //     // } catch (err) {
  //     //   setSystemMsg(`Driver init failed, id: ${circuit_driver_id}, err: ${err}`);
  //     // }
  //   }

  //   fn().then();
  // }, [proofInstance, setProofGenElement]);

  if (ret === null || !proofInstance) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.isLoading}>Loading...</div>
      </div>
    );
  }

  const { headerLabel, consoleUrl, proveResult } = ret;

  return (
    <>
      <ProofTypeMasthead
        proofInstanceId={proofInstanceId}
        proofType={undefined}
        handleSelectProofType={handleSelectProofType}
      />
      <div className={styles.wrapper}>
        <div className={styles.meta}>
          <div className={styles.upperRow}>
            <a href={consoleUrl}>
              <p>{i18n.view_in_console}</p>
              <BiLinkExternal />
            </a>
          </div>
          <div className={styles.bannerContainer}>
            <TutorialStepper steps={[5]}>
              <ProofBanner
                proofInstance={proofInstance}
                webappProofEndpoint={envs.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}
              />
            </TutorialStepper>
          </div>
          <ul>
            <li>
              <SocialSharePopover />
            </li>
          </ul>
          <div className={styles.proofDetailContainer}>
            <div>
              <div className={styles.content}>
                <p className={styles.label}>{proofInstance.proof_label}</p>
                <p className={styles.desc}>{proofInstance.proof_desc}</p>
                <div>
                  {/* <VerifyProofForm */}
                  {/*   proveResult={proveResult} */}
                  {/*   circuitTypeId={proofInstance.circuit_type_id} */}
                  {/*   circuitDriverId={proofInstance.circuit_driver_id} */}
                  {/*   isVerifyOpen={true} */}
                  {/*   proofGenElement={proofGenElement} */}
                  {/* /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProofDetailView;

export interface ProofDetailViewProps {
  // proofInstance: PrfsProofInstanceSyn1;
  proofInstanceId: string;
}
