import React from "react";
import { useRouter } from "next/navigation";
import { PrfsPoll } from "@taigalabs/prfs-entities/bindings/PrfsPoll";
import { PollQuestion } from "@taigalabs/prfs-entities/bindings/PollQuestion";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { ethers } from "ethers";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import ProofGenElement from "@taigalabs/prfs-sdk-web/src/proof_gen_element/proof_gen_element";
import { PrfsPollResponse } from "@taigalabs/prfs-entities/bindings/PrfsPollResponse";

import styles from "./PollResultView.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";

const PollResultView: React.FC<PollResultViewProps> = ({ poll_responses }) => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();

  return (
    <div className={styles.wrapper}>
      3{/* <div> */}
      {/*   <p className={styles.label}>{poll.label}</p> */}
      {/*   <p className={styles.desc}>{poll.description}</p> */}
      {/* </div> */}
    </div>
  );
};

export default PollResultView;

export interface PollResultViewProps {
  poll_responses: PrfsPollResponse[];
}
