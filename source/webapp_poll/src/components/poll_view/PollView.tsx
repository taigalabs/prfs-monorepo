import React from "react";
import { Cell, flexRender, Row } from "@tanstack/react-table";
import { PrfsProofInstanceSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofInstanceSyn1";
import { useRouter } from "next/navigation";
import { PrfsPoll } from "@taigalabs/prfs-entities/bindings/PrfsPoll";
import { PollQuestion } from "@taigalabs/prfs-entities/bindings/PollQuestion";

import styles from "./PollView.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import Question from "./Question";

const PollView: React.FC<PollViewProps> = ({ poll }) => {
  const router = useRouter();

  const questionsElem = React.useMemo(() => {
    return poll.questions.map((qst, idx) => {
      const question = qst as PollQuestion;
      return <Question key={idx} idx={idx} question={question} />;
    });
  }, [poll]);

  console.log(22, poll);

  return (
    <div className={styles.wrapper}>
      <div>
        <p className={styles.label}>{poll.label}</p>
        <p className={styles.desc}>{poll.description}</p>
      </div>
      <div className={styles.questions}>{questionsElem}</div>
    </div>
  );
};

export default PollView;

export interface PollViewProps {
  poll: PrfsPoll;
}
