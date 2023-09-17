import React from "react";
import { Cell, flexRender, Row } from "@tanstack/react-table";
import { PrfsProofInstanceSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofInstanceSyn1";
import { useRouter } from "next/navigation";
import { PrfsPoll } from "@taigalabs/prfs-entities/bindings/PrfsPoll";

import styles from "./PollView.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";

const PollView: React.FC<PollViewProps> = ({ poll }) => {
  const router = useRouter();

  console.log(22, poll);

  return (
    <div className={styles.wrapper}>
      <div>
        <p>{poll.label}</p>
      </div>
    </div>
  );
};

export default PollView;

export interface PollViewProps {
  poll: PrfsPoll;
}
