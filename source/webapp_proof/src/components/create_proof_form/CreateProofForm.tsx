"use client";

import React from "react";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import Fade from "@taigalabs/prfs-react-components/src/fade/Fade";
import cn from "classnames";
import { v4 as uuidv4 } from "uuid";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { ProveReceipt } from "@taigalabs/prfs-driver-interface";
import { FaCloudMoon } from "@react-icons/all-files/fa/FaCloudMoon";
import { useRouter } from "next/navigation";
import ProofGenElement from "@taigalabs/prfs-sdk-web/src/proof_gen_element/proof_gen_element";
import SelectProofTypeDialog from "@taigalabs/prfs-react-components/src/select_proof_type_dialog/SelectProofTypeDialog";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { useMutation } from "@tanstack/react-query";
import { GetPrfsProofTypeByProofTypeIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsProofTypeByProofTypeIdRequest";

import styles from "./CreateProofForm.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import CreateProofModule from "@/components/create_proof_module/CreateProofModule";
import { CreatePrfsProofInstanceRequest } from "@taigalabs/prfs-entities/bindings/CreatePrfsProofInstanceRequest";

const CreateProofForm: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const [selectedProofTypeItem, setSelectedProofTypeItem] = React.useState<ProofTypeItem>();
  const [proofType, setProofType] = React.useState<PrfsProofType>();
  const [proofGenElement, setProofGenElement] = React.useState<ProofGenElement>();
  const [proveReceipt, setProveReceipt] = React.useState<ProveReceipt>();
  const router = useRouter();

  const { mutateAsync: getPrfsProofTypeByProofTypeIdRequest } = useMutation({
    mutationFn: (req: GetPrfsProofTypeByProofTypeIdRequest) => {
      return prfsApi2("get_prfs_proof_type_by_proof_type_id", req);
    },
  });

  const { mutateAsync: createPrfsProofInstance } = useMutation({
    mutationFn: (req: CreatePrfsProofInstanceRequest) => {
      return prfsApi2("create_prfs_proof_instance", req);
    },
  });

  const handleSelectProofType = React.useCallback(
    async (proofTypeItem: ProofTypeItem) => {
      setSelectedProofTypeItem(proofTypeItem);

      const { payload } = await getPrfsProofTypeByProofTypeIdRequest({
        proof_type_id: proofTypeItem.proofTypeId,
      });

      setProofType(payload.prfs_proof_type);
    },
    [setSelectedProofTypeItem, getPrfsProofTypeByProofTypeIdRequest, setProofType]
  );

  const handleCreateProof = React.useCallback(
    async (err: any, proveReceipt: ProveReceipt | null) => {
      if (err) {
        console.error(err);
      } else if (proveReceipt !== null) {
        setProveReceipt(proveReceipt);
      }
    },
    [selectedProofTypeItem, proofGenElement, setProveReceipt]
  );

  const handleClickUpload = React.useCallback(async () => {
    if (proveReceipt && selectedProofTypeItem) {
      const { proveResult } = proveReceipt;
      const { proof, publicInputSer } = proveResult;
      const public_inputs = JSON.parse(publicInputSer);

      const proof_instance_id = uuidv4();

      console.log("try inserting proof", proveReceipt);
      try {
        const { payload } = await createPrfsProofInstance({
          proof_instance_id,
          account_id: null,
          proof_type_id: selectedProofTypeItem.proofTypeId,
          proof: Array.from(proof),
          public_inputs,
        });

        router.push(`${paths.proofs}/${payload.proof_instance_id}`);
      } catch (err: any) {
        console.error(err);
        return;
      }
    }
  }, [proveReceipt]);

  return (
    <div className={styles.wrapper}>
      <div
        className={cn({
          [styles.formWrapper]: true,
          [styles.successShadow]: !!proveReceipt,
        })}
      >
        <div className={styles.proofTypeRow}>
          <p>{i18n.you_would_like_to_prove}</p>
          <div className={styles.select}>
            <SelectProofTypeDialog handleSelectProofType={handleSelectProofType} />
          </div>
        </div>
        {proofType && (
          <Fade>
            <div className={styles.sdkArea}>
              <CreateProofModule proofType={proofType} handleCreateProof={handleCreateProof} />
            </div>
          </Fade>
        )}
      </div>
      {proveReceipt && (
        <Fade>
          <div className={styles.bottomRow}>
            <div className={styles.postCreateMenu}>
              <div className={styles.successMsg}>
                <FaCloudMoon />
                <p>{i18n.prove_success_msg}</p>
              </div>
              <div className={styles.uploadSection}>
                <p>
                  <span>{i18n.proof_creation_summary_msg} </span>
                  <i>{Math.floor((proveReceipt.duration / 1000) * 1000) / 1000} secs. </i>
                  <span>{i18n.proof_upload_guide}</span>
                </p>
                <ul className={styles.btnGroup}>
                  <li>
                    <Button variant="transparent_black_1" handleClick={handleClickUpload}>
                      {i18n.upload_and_view_proof.toUpperCase()}
                    </Button>
                  </li>
                  <li>
                    <Button variant="transparent_black_1" handleClick={() => {}} disabled>
                      {i18n.just_view_proof.toUpperCase()}
                    </Button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Fade>
      )}
    </div>
  );
};

export default CreateProofForm;

export interface ProofTypeItem {
  proofTypeId: string;
  label: string;
  imgUrl: string | null;
}
