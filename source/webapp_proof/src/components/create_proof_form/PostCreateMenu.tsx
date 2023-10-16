import React from "react";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import Fade from "@taigalabs/prfs-react-components/src/fade/Fade";
import cn from "classnames";
import { v4 as uuidv4 } from "uuid";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { ProveReceipt } from "@taigalabs/prfs-driver-interface";
import { FaCloudMoon } from "@react-icons/all-files/fa/FaCloudMoon";
import { FaCheck } from "@react-icons/all-files/fa/FaCheck";
import { useRouter } from "next/navigation";
import ProofGenElement from "@taigalabs/prfs-sdk-web/src/proof_gen_element/proof_gen_element";
import SelectProofTypeDialog from "@taigalabs/prfs-react-components/src/select_proof_type_dialog/SelectProofTypeDialog";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { useMutation } from "@tanstack/react-query";
import { GetPrfsProofTypeByProofTypeIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsProofTypeByProofTypeIdRequest";
import { CreatePrfsProofInstanceRequest } from "@taigalabs/prfs-entities/bindings/CreatePrfsProofInstanceRequest";

import styles from "./PostCreateMenu.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import CreateProofModule from "@/components/create_proof_module/CreateProofModule";

const PostCreateMenu: React.FC<PostCreateMenuProps> = ({ proveReceipt, handleClickUpload }) => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      <div className={styles.successMsg}>
        <FaCheck />
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
  proveReceipt: ProveReceipt;
  handleClickUpload: () => Promise<void>;
}
