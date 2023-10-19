"use client";

import React from "react";
import Fade from "@taigalabs/prfs-react-components/src/fade/Fade";
import cn from "classnames";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { ProveReceipt } from "@taigalabs/prfs-driver-interface";
import SelectProofTypeDialog from "@taigalabs/prfs-react-components/src/select_proof_type_dialog/SelectProofTypeDialog";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { useMutation } from "@tanstack/react-query";
import { GetPrfsProofTypeByProofTypeIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsProofTypeByProofTypeIdRequest";

import styles from "./CreateProofForm.module.scss";
import { i18nContext } from "@/contexts/i18n";
import CreateProofModule from "@/components/create_proof_module/CreateProofModule";
import PostCreateMenu from "./PostCreateMenu";
import LogoContainer from "./LogoContainer";
import { useSearchParams } from "next/navigation";
import Tutorial from "../tutorial/Tutorial";
import Link from "next/link";
import { paths } from "@/paths";
import TutorialStepper from "../tutorial/TutorialStepper";

const CreateProofForm: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const [proofType, setProofType] = React.useState<PrfsProofType>();
  const [proveReceipt, setProveReceipt] = React.useState<ProveReceipt>();
  const searchParams = useSearchParams();

  const isTutorial = React.useMemo(() => {
    if (searchParams.get("tutorial") !== null) {
      return true;
    }
    return false;
  }, [searchParams]);

  const { mutateAsync: getPrfsProofTypeByProofTypeIdRequest } = useMutation({
    mutationFn: (req: GetPrfsProofTypeByProofTypeIdRequest) => {
      return prfsApi2("get_prfs_proof_type_by_proof_type_id", req);
    },
  });

  const handleSelectProofType = React.useCallback(
    async (proofType: PrfsProofType) => {
      const { payload } = await getPrfsProofTypeByProofTypeIdRequest({
        proof_type_id: proofType.proof_type_id,
      });

      setProofType(payload.prfs_proof_type);
    },
    [getPrfsProofTypeByProofTypeIdRequest, setProofType]
  );

  const handleCreateProof = React.useCallback(
    async (err: any, proveReceipt: ProveReceipt | null) => {
      if (err) {
        console.error(err);
      } else if (proveReceipt !== null) {
        setProveReceipt(proveReceipt);
      }
    },
    [setProveReceipt]
  );

  return (
    <div className={styles.wrapper}>
      <LogoContainer proofTypeChosen={!!proofType} />
      <div className={cn({ [styles.formArea]: true, [styles.proofTypeChosen]: !!proofType })}>
        {proveReceipt ? (
          <Fade>
            <PostCreateMenu proveReceipt={proveReceipt} proofType={proofType!} />
          </Fade>
        ) : (
          <div
            className={cn({
              [styles.formWrapper]: true,
              [styles.proofTypeChosen]: !!proofType,
            })}
          >
            <div className={styles.proofTypeRow}>
              <TutorialStepper stages={[1]}>
                <SelectProofTypeDialog
                  proofType={proofType}
                  handleSelectProofType={handleSelectProofType}
                />
              </TutorialStepper>
            </div>
            {!proofType && (
              <div className={styles.welcomeRow}>
                <span>{i18n.create_and_share_proofs}</span>
                <Link href={`${paths.__}/?tutorial=1`}>How?</Link>
              </div>
            )}
            {proofType && (
              <div className={styles.sdkRow}>
                <Fade>
                  <CreateProofModule proofType={proofType} handleCreateProof={handleCreateProof} />
                </Fade>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateProofForm;

export interface ProofTypeItem {
  proofTypeId: string;
  label: string;
  imgUrl: string | null;
}
