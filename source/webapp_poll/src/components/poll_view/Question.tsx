import React from "react";
import { Cell, flexRender, Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { PollQuestion } from "@taigalabs/prfs-entities/bindings/PollQuestion";
import { PollQuestionChoice } from "@taigalabs/prfs-entities/bindings/PollQuestionChoice";

import styles from "./Question.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";

const Question: React.FC<QuestionProps> = ({ question, idx }) => {
  return (
    <div className={styles.wrapper}>
      <p className={styles.idx}>{idx}</p>
      <p className={styles.label}>{question.label}</p>
      <p className={styles.required}>{question.required === true ? "Required" : ""}</p>
      <div>
        {question.choices.map((choice, choiceIdx) => (
          <div key={choiceIdx} className={styles.choice}>
            <input type="radio" />
            {choice.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Question;

export interface QuestionProps {
  idx: number;
  question: PollQuestion;
}

export interface ChoiceProps {
  choice: PollQuestionChoice;
}
