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
import { CreatePrfsProofRequest } from "@taigalabs/prfs-entities/bindings/CreatePrfsProofRequest";
import { CreatePrfsProofAction } from "@taigalabs/prfs-entities/bindings/CreatePrfsProofAction";
import { computeAddress } from "@taigalabs/prfs-crypto-deps-js/ethers/lib/utils";
import { MerkleSigPosRangeV1PublicInputs } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1PublicInputs";
import { utils as walletUtils } from "@taigalabs/prfs-crypto-deps-js/ethers";

import styles from "./CreateProofResult.module.scss";
import { i18nContext } from "@/i18n/context";
import VerifyProofModule from "@/components/verify_proof_module/VerifyProofModule";
import Loading from "@/components/loading/Loading";
import { useAppDispatch } from "@/state/hooks";
import { setGlobalMsg } from "@/state/globalMsgReducer";
import { paths } from "@/paths";

const CreateProofResult: React.FC<CreateProofResultProps> = ({
  proofAction,
  proveReceipt,
  proofType,
  handleClickStartOver,
}) => {
  const i18n = React.useContext(i18nContext);
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isVerifyOpen, setIsVerifyOpen] = React.useState(true);
  const [isNavigating, setIsNavigating] = React.useState(false);

  const { mutateAsync: createPrfsProof, isPending: isCreatePrfsProofPending } = useMutation({
    mutationFn: (req: CreatePrfsProofRequest) => {
      return prfsApi3({ type: "create_prfs_proof", ...req });
    },
  });

  const handleClickVerify = React.useCallback(() => {
    setIsVerifyOpen(s => !s);
  }, [setIsVerifyOpen]);

  const handleClickUpload = React.useCallback(async () => {
    if (proveReceipt && proofAction) {
      const { proof } = proveReceipt;
      const { publicInputSer } = proof;
      const publicInputs: MerkleSigPosRangeV1PublicInputs = JSONbigNative.parse(publicInputSer);
      const prfs_proof_id = rand256Hex().substring(0, 14);
      // console.log("proveReceipt: %o", proveReceipt);

      const recoveredAddr = walletUtils.verifyMessage(
        proveReceipt.proofActionSigMsg,
        proveReceipt.proofActionSig,
      );
      const addr = computeAddress(publicInputs.proofPubKey);
      if (recoveredAddr !== addr) {
        dispatch(
          setGlobalMsg({
            variant: "error",
            message: `Signature does not match, recovered: ${recoveredAddr}, addr: ${addr}`,
          }),
        );
        return;
      }

      try {
        const { payload } = await createPrfsProof({
          prfs_proof_id,
          proof_identity_input: publicInputs.proofIdentityInput,
          proof: Array.from(proveReceipt.proof.proofBytes),
          public_inputs: proveReceipt.proof.publicInputSer,
          serial_no: JSONbigNative.stringify(publicInputs.circuitPubInput.serialNo),
          author_public_key: publicInputs.proofPubKey,
          author_sig: proveReceipt.proofActionSig,
          author_sig_msg: Array.from(proveReceipt.proofActionSigMsg),
          proof_type_id: proofType.proof_type_id,
          nonce: proofAction.nonce,
        });

        if (payload) {
          setIsNavigating(true);
          router.push(`${paths.p}/${payload.prfs_proof_id}`);
        }
      } catch (err: any) {
        console.error(err);
        return;
      }
    }
  }, [proveReceipt, searchParams, createPrfsProof, proofAction, dispatch, setIsNavigating]);

  return (
    <div className={styles.wrapper}>
      {isNavigating ? (
        <span>Successfully uploaded proof. Navigating...</span>
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
                    [styles.inProgress]: isCreatePrfsProofPending,
                  })}
                  disabled={isCreatePrfsProofPending}
                >
                  {isCreatePrfsProofPending && <Spinner color={colors.bright_gray_33} size={20} />}
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
  proofAction: CreatePrfsProofAction | null;
  proofType: PrfsProofTypeSyn1;
  proveReceipt: ProveReceipt;
  handleClickStartOver: () => void;
}
