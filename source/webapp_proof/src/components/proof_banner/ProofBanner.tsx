import React from "react";
import Link from "next/link";
import QRCode from "qrcode";
import { useRouter } from "next/navigation";
import { PrfsProofInstanceSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofInstanceSyn1";
import { PublicInputMeta } from "@taigalabs/prfs-entities/bindings/PublicInputMeta";
import { AiOutlineQrcode } from "@react-icons/all-files/ai/AiOutlineQrcode";

import styles from "./ProofBanner.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import ProofImage from "../proof_image/ProofImage";
import ProofInstanceQRCode from "../proof_instance_qrcode/ProofInstanceQRCode";
import Popover from "@taigalabs/prfs-react-components/src/popover/Popover";
import { envs } from "@/envs";

const ProofBanner: React.FC<ProofBannerProps> = ({ proofInstance }) => {
  const i18n = React.useContext(i18nContext);

  const { prioritizedValues, url } = React.useMemo(() => {
    const { public_inputs_meta, public_inputs, short_id } = proofInstance;

    const url = `${envs.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}/p/${short_id}`;

    let accessors = [];
    let values = [];
    for (const meta of public_inputs_meta as PublicInputMeta[]) {
      if (meta.show_priority === 0) {
        accessors.push(meta.name);
      }
    }

    for (const accessor of accessors) {
      if (public_inputs[accessor]) {
        values.push(public_inputs[accessor]);
      }
    }

    return { prioritizedValues: values, url };
  }, [proofInstance]);

  const createBase = React.useCallback((_: boolean) => {
    return <AiOutlineQrcode />;
  }, []);

  const createPopover = React.useCallback(
    (_: React.Dispatch<React.SetStateAction<any>>) => {
      return <ProofInstanceQRCode proofInstance={proofInstance} />;
    },
    [proofInstance]
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.imgContainer}>
        <ProofImage img_url={proofInstance.img_url} img_caption={proofInstance.img_caption} />
      </div>
      <div className={styles.content}>
        <div className={styles.expression}>{proofInstance.expression}</div>
        <div className={styles.prioritizedValues}>{prioritizedValues.join(",")}</div>
        <div className={styles.bottom}>
          <div>By {proofInstance.proof_label}</div>
          <div className={styles.url}>{url}</div>
        </div>
      </div>
      <div className={styles.menu}>
        <Popover createBase={createBase} createPopover={createPopover} />
      </div>
    </div>
  );
};

export default ProofBanner;

export interface ProofBannerProps {
  proofInstance: PrfsProofInstanceSyn1;
}
