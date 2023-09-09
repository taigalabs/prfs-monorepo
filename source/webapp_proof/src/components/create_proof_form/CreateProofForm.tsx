import React from "react";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import Fade from "@taigalabs/prfs-react-components/src/fade/Fade";
import { PrfsSDK } from "@taigalabs/prfs-sdk-web";
import { v4 as uuidv4 } from "uuid";
import { ethers } from "ethers";
import { prfsApi2 } from "@taigalabs/prfs-api-js";

import styles from "./CreateProofForm.module.scss";
import { i18nContext } from "@/contexts/i18n";
import SelectProofTypeDialog from "@/components/select_proof_type_dialog/SelectProofTypeDialog";
import ProofGenElement from "@taigalabs/prfs-sdk-web/src/proof_gen_element/proof_gen_element";

const prfs = new PrfsSDK("test");

const CreateProofForm: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const [selectedProofTypeItem, setSelectedProofTypeItem] = React.useState<ProofTypeItem>();
  const [proofGenElement, setProofGenElement] = React.useState<ProofGenElement>();

  const handleSelectProofType = React.useCallback(
    (proofTypeItem: ProofTypeItem) => {
      setSelectedProofTypeItem(proofTypeItem);
    },
    [setSelectedProofTypeItem]
  );

  const handleCreateProof = React.useCallback(({ proof, publicInput }: any) => {
    console.log("Created proof!", proof, publicInput);
  }, []);

  React.useEffect(() => {
    async function fn() {
      if (selectedProofTypeItem) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const proofGenElement = prfs.create("proof-gen", {
          proofTypeId: selectedProofTypeItem.proofTypeId,
          provider,
          handleCreateProof,
        });

        await proofGenElement.mount("#prfs-sdk-container");

        setProofGenElement(proofGenElement);
      }
    }

    fn().then();
  }, [selectedProofTypeItem, handleCreateProof, setProofGenElement]);

  const handleClickCreateProof = React.useCallback(async () => {
    if (!selectedProofTypeItem) {
      console.error("proof type is not selected");
      return;
    }

    if (!proofGenElement) {
      console.error("PRFS sdk is undefined");
      return;
    }

    const proveReceipt = await proofGenElement.createProof();

    if (proveReceipt) {
      const { duration, proveResult } = proveReceipt;
      const { proof, publicInputSer } = proveResult;
      const public_inputs = JSON.parse(publicInputSer);

      console.log("took %s ms to create a proof", duration);

      const proof_instance_id = uuidv4();

      console.log("try inserting proof", proveReceipt);
      try {
        const { payload } = await prfsApi2("create_prfs_proof_instance", {
          proof_instance_id,
          account_id: null,
          proof_type_id: selectedProofTypeItem.proofTypeId,
          proof: Array.from(proof),
          public_inputs,
        });

        // router.push(`${paths.proof_instances}/${payload.proof_instance_id}`);
      } catch (err: any) {
        console.error(err);
        return;
      }
    }
  }, [selectedProofTypeItem, proofGenElement]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.proofTypeRow}>
        <p>{i18n.you_would_like_to_prove}</p>
        <div className={styles.select}>
          <SelectProofTypeDialog handleSelectProofType={handleSelectProofType} />
        </div>
      </div>
      {selectedProofTypeItem && (
        <Fade>
          <div id="prfs-sdk-container"></div>
        </Fade>
      )}
      <div className={styles.createProofBtn}>
        <Button variant="aqua_blue_1" handleClick={handleClickCreateProof}>
          {i18n.create_proof.toUpperCase()}
        </Button>
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
