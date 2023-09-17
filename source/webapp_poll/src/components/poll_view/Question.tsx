import React from "react";
import { Cell, flexRender, Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { PollQuestion } from "@taigalabs/prfs-entities/bindings/PollQuestion";
import { PollQuestionChoice } from "@taigalabs/prfs-entities/bindings/PollQuestionChoice";

import styles from "./Question.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import { PollQuestionType } from "@taigalabs/prfs-entities/bindings/PollQuestionType";

const Choices: React.FC<ChoicesProps> = ({ choices, type }) => {
  const inputType = getInputType(type);

  return choices.map((choice, idx) => {
    return (
      <div key={idx} className={styles.choice}>
        <input type={inputType} />
        {choice.label}
      </div>
    );
  });
};

const Question: React.FC<QuestionProps> = ({ question, idx }) => {
  return (
    <div className={styles.wrapper}>
      <div>
        <span className={styles.idx}>{idx + 1}</span>
        <span className={styles.label}>{question.label}</span>
      </div>
      {/* <p className={styles.required}>{question.required === true ? "Required" : ""}</p> */}
      <div className={styles.choices}>
        <Choices choices={question.choices as PollQuestionChoice[]} type={question.type} />
      </div>
    </div>
  );
};

export default Question;

function getInputType(type: PollQuestionType): string {
  switch (type) {
    case "MultipleChoice":
      return "radio";
    case "Checkboxes":
      return "checkbox";
    case "Text":
    default:
      return "text";
  }
}

export interface QuestionProps {
  idx: number;
  question: PollQuestion;
}

export interface ChoicesProps {
  choices: PollQuestionChoice[];
  type: PollQuestionType;
}
