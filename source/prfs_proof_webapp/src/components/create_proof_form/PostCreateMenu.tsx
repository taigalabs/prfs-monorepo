import React from "react";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import cn from "classnames";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { ProveReceipt } from "@taigalabs/prfs-driver-interface";
import { useRouter, useSearchParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { useMutation } from "@tanstack/react-query";
import { CreatePrfsProofInstanceRequest } from "@taigalabs/prfs-entities/bindings/CreatePrfsProofInstanceRequest";
import CaptionedImg from "@taigalabs/prfs-react-lib/src/captioned_img/CaptionedImg";
import { IoIosArrowDown } from "@react-icons/all-files/io/IoIosArrowDown";
import JSONBig from "json-bigint";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import colors from "@taigalabs/prfs-react-lib/src/colors.module.scss";
import TutorialStepper from "@taigalabs/prfs-react-lib/src/tutorial/TutorialStepper";
import { useIsTutorial } from "@taigalabs/prfs-react-lib/src/hooks/tutorial";

import styles from "./PostCreateMenu.module.scss";
import { i18nContext } from "@/i18n/context";
import { paths } from "@/paths";
import VerifyProofModule from "@/components/verify_proof_module/VerifyProofModule";
import ProofDataView from "@/components/proof_data_view/ProofDataView";
import { useAppSelector } from "@/state/hooks";

const JSONbigNative = JSONBig({
  useNativeBigInt: true,
  alwaysParseAsBig: true,
  storeAsString: true,
});

const PostCreateMenu: React.FC<PostCreateMenuProps> = ({ proveReceipt, proofType }) => {
  const i18n = React.useContext(i18nContext);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isVerifyOpen, setIsVerifyOpen] = React.useState(false);
  const step = useAppSelector(state => state.tutorial.tutorialStep);
  const isTutorial = useIsTutorial();

  const {
    mutateAsync: createPrfsProofInstance,
    isPending: isCreatePrfsProofInstancePending,
    isSuccess: isCreatePrfsProofInstanceSuccess,
  } = useMutation({
    mutationFn: (req: CreatePrfsProofInstanceRequest) => {
      return prfsApi2("create_prfs_proof_instance", req);
    },
  });

  const handleClickVerify = React.useCallback(() => {
    setIsVerifyOpen(s => !s);
  }, [setIsVerifyOpen]);

  const handleClickUpload = React.useCallback(async () => {
    if (proveReceipt && proofType) {
      const { proof } = proveReceipt;
      const { proofBytes, publicInputSer } = proof;
      const public_inputs = JSONbigNative.parse(publicInputSer);
      const proof_instance_id = uuidv4();

      try {
        const { payload } = await createPrfsProofInstance({
          proof_instance_id,
          account_id: null,
          proof_type_id: proofType.proof_type_id,
          proof: Array.from(proofBytes),
          public_inputs,
        });
        const params = searchParams.toString();

        if (payload) {
          router.push(`${paths.proofs}/${payload.proof_instance_id}?${params}`);
        }
      } catch (err: any) {
        console.error(err);
        return;
      }
    }
  }, [proveReceipt, searchParams]);

  return (
    <div className={styles.wrapper}>
      {isCreatePrfsProofInstanceSuccess ? (
        <div>Loading...</div>
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
                <a href={paths.__}>
                  <Button variant="transparent_blue_1">{i18n.start_over}</Button>
                </a>
              </li>
            </ul>
            <ul>
              <li>
                <TutorialStepper isVisible={isTutorial} step={step} steps={[4]}>
                  <Button
                    variant="blue_1"
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
                </TutorialStepper>
              </li>
            </ul>
          </div>
          <div className={cn(styles.verifyProofFormRow, { [styles.isVerifyOpen]: isVerifyOpen })}>
            <div>
              <TutorialStepper isVisible={isTutorial} step={step} steps={[3]}>
                <button className={cn(styles.verifyBtn)} onClick={handleClickVerify}>
                  <span>{i18n.verify}</span>
                  <IoIosArrowDown />
                </button>
              </TutorialStepper>
            </div>
            <div className={styles.verifyProofFormWrapper}>
              <ProofDataView proof={proveReceipt.proof} isCard />
              {/* <div className={styles.verifyProofModuleWrapper}> */}
              {/*   <VerifyProofModule */}
              {/*     // proofGenElement={proofGenElement} */}
              {/*     proof={proveReceipt.proof} */}
              {/*     circuitTypeId={proofType.circuit_type_id} */}
              {/*   /> */}
              {/* </div> */}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PostCreateMenu;

export interface PostCreateMenuProps {
  proofType: PrfsProofType;
  proveReceipt: ProveReceipt;
  // proofGenElement: ProofGenElement;
}
