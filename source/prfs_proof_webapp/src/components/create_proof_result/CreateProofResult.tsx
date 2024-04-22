import React from "react";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import cn from "classnames";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { prfsApi3 } from "@taigalabs/prfs-api-js";
import { ProveReceipt } from "@taigalabs/prfs-driver-interface";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@taigalabs/prfs-react-lib/react_query";
import { CreatePrfsProofInstanceRequest } from "@taigalabs/prfs-entities/bindings/CreatePrfsProofInstanceRequest";
import CaptionedImg from "@taigalabs/prfs-react-lib/src/captioned_img/CaptionedImg";
import { IoIosArrowDown } from "@react-icons/all-files/io/IoIosArrowDown";
import ProofDataView from "@taigalabs/prfs-react-lib/src/proof_data_view/ProofDataView";
import colors from "@taigalabs/prfs-react-lib/src/colors.module.scss";
import { PrfsProofTypeSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofTypeSyn1";
import { JSONbigNative, rand256Hex } from "@taigalabs/prfs-crypto-js";

import styles from "./CreateProofResult.module.scss";
import { i18nContext } from "@/i18n/context";
import VerifyProofModule from "@/components/verify_proof_module/VerifyProofModule";
import Loading from "@/components/loading/Loading";

const CreateProofResult: React.FC<CreateProofResultProps> = ({
  proveReceipt,
  proofType,
  handleClickStartOver,
}) => {
  const i18n = React.useContext(i18nContext);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isVerifyOpen, setIsVerifyOpen] = React.useState(true);

  const { mutateAsync: createPrfsProofInstance, isPending: isCreatePrfsProofInstancePending } =
    useMutation({
      mutationFn: (req: CreatePrfsProofInstanceRequest) => {
        return prfsApi3({ type: "create_prfs_proof_instance", ...req });
      },
    });

  const handleClickVerify = React.useCallback(() => {
    setIsVerifyOpen(s => !s);
  }, [setIsVerifyOpen]);

  const handleClickUpload = React.useCallback(async () => {
    if (proveReceipt) {
      const { proof, proofAction, proofActionSig, proofActionSigMsg } = proveReceipt;
      const { proofBytes, publicInputSer } = proof;
      const public_inputs = JSONbigNative.parse(publicInputSer);
      const proof_instance_id = rand256Hex();

      console.log(11, proveReceipt);

      // try {
      //   const { payload } = await createPrfsProofInstance({
      //     proof_instance_id,
      //     account_id: null,
      //     proof_type_id: proofType.proof_type_id,
      //     proof: Array.from(proofBytes),
      //     public_inputs,
      //   });
      //   const params = searchParams.toString();
      //   if (payload) {
      //     router.push(`${paths.proofs}/${payload.proof_instance_id}?${params}`);
      //   }
      // } catch (err: any) {
      //   console.error(err);
      //   return;
      // }
    }
  }, [proveReceipt, searchParams, createPrfsProofInstance]);

  return (
    <div className={styles.wrapper}>
      {isCreatePrfsProofInstancePending ? (
        <Loading />
      ) : (
        <>
          <div className={styles.header}>
            <CaptionedImg
              img_url="https://d1w1533jipmvi2.cloudfront.net/tata_Emojione_1F389.svg.png"
              alt="tada"
              size={48}
            />
            <div className={styles.title}>
              <p>{i18n.prove_success_msg}</p>
            </div>
            <div className={styles.proofType}>
              <CaptionedImg img_url={proofType.img_url} size={20} />
              <p className={styles.proofTypeLabel}>{proofType.label}</p>
            </div>
          </div>
          <div className={styles.uploadSection}>
            <span>{i18n.proof_creation_summary_msg} </span>
            <i>{Math.floor((proveReceipt.duration / 1000) * 1000) / 1000} secs. </i>
            <span>{i18n.proof_upload_guide}</span>
          </div>
          <div className={styles.postCreateBtnGroup}>
            <ul>
              <li>
                <Button variant="transparent_blue_3" handleClick={handleClickStartOver}>
                  {i18n.start_over}
                </Button>
              </li>
            </ul>
            <ul>
              <li>
                <Button
                  variant="blue_3"
                  handleClick={handleClickUpload}
                  className={cn(styles.uploadBtn, {
                    [styles.inProgress]: isCreatePrfsProofInstancePending,
                  })}
                  disabled={isCreatePrfsProofInstancePending}
                >
                  {isCreatePrfsProofInstancePending && (
                    <Spinner color={colors.bright_gray_33} size={20} />
                  )}
                  <span>{i18n.upload}</span>
                </Button>
              </li>
            </ul>
          </div>
          <div className={cn(styles.verifyProofFormRow, { [styles.isVerifyOpen]: isVerifyOpen })}>
            <div>
              <button className={cn(styles.verifyBtn)} onClick={handleClickVerify}>
                <span>{i18n.verify}</span>
                <IoIosArrowDown />
              </button>
            </div>
            <div className={styles.verifyProofFormWrapper}>
              <ProofDataView proof={proveReceipt.proof} isCard />
              <div className={styles.verifyProofModuleWrapper}>
                <VerifyProofModule
                  proof={proveReceipt.proof}
                  proofTypeId={proofType.proof_type_id}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CreateProofResult;

export interface CreateProofResultProps {
  proofType: PrfsProofTypeSyn1;
  proveReceipt: ProveReceipt;
  handleClickStartOver: () => void;
}
