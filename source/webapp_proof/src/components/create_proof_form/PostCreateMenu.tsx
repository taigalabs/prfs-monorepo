import React from "react";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import cn from "classnames";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { ProveReceipt } from "@taigalabs/prfs-driver-interface";
import { FaCheck } from "@react-icons/all-files/fa/FaCheck";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { useMutation } from "@tanstack/react-query";
import { CreatePrfsProofInstanceRequest } from "@taigalabs/prfs-entities/bindings/CreatePrfsProofInstanceRequest";

import styles from "./PostCreateMenu.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";

const PostCreateMenu: React.FC<PostCreateMenuProps> = ({ proveReceipt, proofType }) => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();

  const { mutateAsync: createPrfsProofInstance } = useMutation({
    mutationFn: (req: CreatePrfsProofInstanceRequest) => {
      return prfsApi2("create_prfs_proof_instance", req);
    },
  });

  const handleClickUpload = React.useCallback(async () => {
    if (proveReceipt && proofType) {
      const { proveResult } = proveReceipt;
      const { proof, publicInputSer } = proveResult;
      const public_inputs = JSON.parse(publicInputSer);

      const proof_instance_id = uuidv4();

      console.log("try inserting proof", proveReceipt);
      try {
        const { payload } = await createPrfsProofInstance({
          proof_instance_id,
          account_id: null,
          proof_type_id: proofType.proof_type_id,
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
      <div className={styles.title}>
        {/* <FaCheck /> */}
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
            <Button variant="aqua_blue_1" handleClick={handleClickUpload}>
              {i18n.upload}
            </Button>
          </li>
          <li>
            <Button variant="transparent_black_1" handleClick={() => {}} disabled>
              {i18n.verify.toUpperCase()}
            </Button>
          </li>
          <li>
            <Button variant="transparent_black_1" handleClick={() => {}} disabled>
              {i18n.view_proof.toUpperCase()}
            </Button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PostCreateMenu;

export interface PostCreateMenuProps {
  proofType: PrfsProofType;
  proveReceipt: ProveReceipt;
}
