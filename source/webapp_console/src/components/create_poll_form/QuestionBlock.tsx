import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import ArrowButton from "@taigalabs/prfs-react-components/src/arrow_button/ArrowButton";
import { useMutation } from "@tanstack/react-query";
import SelectProofTypeDialog from "@taigalabs/prfs-react-components/src/select_proof_type_dialog/SelectProofTypeDialog";

import styles from "./QuestionBlock.module.scss";
import { i18nContext } from "@/contexts/i18n";

const QuestionBlock: React.FC<QuestionBlockProps> = ({ question }) => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();

  return (
    <div className={styles.wrapper}>
      <select>
        <option>{i18n.multiple_choice}</option>
        <option>{i18n.checkboxes}</option>
      </select>
    </div>
  );
};

export default QuestionBlock;

export interface QuestionBlockProps {
  question: PollQuestion;
}

export interface PollQuestion {
  type: "multiple_choice" | "checkboxes";
  label: string;
  required: boolean;
}
