import React from "react";
import { Cell, flexRender, Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { PollQuestion } from "@taigalabs/prfs-entities/bindings/PollQuestion";
import { PollQuestionChoice } from "@taigalabs/prfs-entities/bindings/PollQuestionChoice";

import styles from "./Question.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import { PollQuestionType } from "@taigalabs/prfs-entities/bindings/PollQuestionType";

const Choices: React.FC<ChoicesProps> = ({ choices, type, questionIdx, handleChangeForm }) => {
  const inputType = getInputType(type);

  return choices.map((choice, idx) => {
    return (
      <div key={idx} className={styles.choice} onChange={handleChangeForm}>
        <input type={inputType} value={idx} name={questionIdx.toString()} />
        <span>{choice.label}</span>
      </div>
    );
  });
};

const Question: React.FC<QuestionProps> = ({ question, questionIdx, handleChangeForm }) => {
  return (
    <div className={styles.wrapper}>
      <div>
        <span className={styles.idx}>{questionIdx + 1}</span>
        <span className={styles.label}>{question.label}</span>
      </div>
      {/* <p className={styles.required}>{question.required === true ? "Required" : ""}</p> */}
      <div className={styles.choices}>
        <Choices
          questionIdx={questionIdx}
          choices={question.choices as PollQuestionChoice[]}
          type={question.type}
          handleChangeForm={handleChangeForm}
        />
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
  question: PollQuestion;
  questionIdx: number;
  handleChangeForm: (ev: React.ChangeEvent | React.FormEvent) => void;
  // setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

export interface ChoicesProps {
  choices: PollQuestionChoice[];
  type: PollQuestionType;
  questionIdx: number;
  handleChangeForm: (ev: React.ChangeEvent | React.FormEvent) => void;
  // setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}
