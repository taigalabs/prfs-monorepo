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
import ImageLogo from "@taigalabs/prfs-react-components/src/image_logo/ImageLogo";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { useMutation } from "wagmi";
import { GetPrfsProofInstanceByInstanceIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsProofInstanceByInstanceIdRequest";

import styles from "./ProofDetailView.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import VerifyProofForm from "@/components/verify_proof_form/VerifyProofForm";
import { ProveReceipt, ProveResult } from "@taigalabs/prfs-driver-interface";
import ProofGenElement from "@taigalabs/prfs-sdk-web/src/proof_gen_element/proof_gen_element";
import { envs } from "@/envs";
import TutorialStepper from "@/components/tutorial/TutorialStepper";

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

  const { mutateAsync: getPrfsProofInstanceByInstanceIdRequest } = useMutation({
    mutationFn: (req: GetPrfsProofInstanceByInstanceIdRequest) => {
      return prfsApi2("get_prfs_proof_instance_by_instance_id", req);
    },
  });

  const [proofInstance, setProofInstance] = React.useState<PrfsProofInstanceSyn1>();
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
  //
  if (ret === null || !proofInstance) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.isLoading}>Loading...</div>
      </div>
    );
  }

  const { headerLabel, consoleUrl, proveResult } = ret;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.logoContainer}>
          <a href={paths.__}>
            <ImageLogo width={45} />
          </a>
        </div>
        <div className={styles.titleRow}>
          <p className={styles.headerLabel}>{ret.headerLabel}</p>
        </div>
        <div className={styles.buttonRow}>
          <ul>
            <li>
              <Link href={ret.consoleUrl}>
                <Button variant="transparent_blue_1">
                  <HiOutlineDesktopComputer />
                  <span>{i18n.console.toUpperCase()}</span>
                </Button>
              </Link>
            </li>
          </ul>
          <ul>
            <li>
              <Button variant="transparent_blue_1">
                <AiOutlineCopy />
                <span>{i18n.copy_url.toUpperCase()}</span>
              </Button>
            </li>
            <li>
              <SocialSharePopover />
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.content}>
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
  );
};

export default ProofDetailView;

export interface ProofDetailViewProps {
  // proofInstance: PrfsProofInstanceSyn1;
  proofInstanceId: string;
}
