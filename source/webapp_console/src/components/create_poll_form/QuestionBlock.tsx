import React from "react";
import cn from "classnames";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import ArrowButton from "@taigalabs/prfs-react-components/src/arrow_button/ArrowButton";
import { handleChildMessage } from "@taigalabs/prfs-sdk-web/src/proof_gen_element/handle_child_msg";

import styles from "./QuestionBlock.module.scss";
import { i18nContext } from "@/contexts/i18n";
import FormTextareaInput from "../form/FormTextareaInput";

const QuestionBlock: React.FC<QuestionBlockProps> = ({
  question,
  idx,
  handleChangeQuestions,
  setQuestions,
}) => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();

  const handleChangeChoices = React.useCallback(
    (choiceIdx: number, ev: React.ChangeEvent) => {
      const { value } = ev.target as HTMLInputElement;

      setQuestions(oldVals => {
        const newChoices = [...oldVals[idx].choices];
        newChoices[choiceIdx] = {
          ...newChoices[choiceIdx],
          label: value,
        };
        const newVals = [...oldVals];
        newVals[idx].choices = newChoices;

        return newVals;
      });
    },
    [setQuestions]
  );

  const choicesElem = React.useMemo(() => {
    return question.choices?.map((choice, idx) => {
      return (
        <div className={cn(styles.choice)} key={idx}>
          <input value={choice.label} onChange={ev => handleChangeChoices(idx, ev)} />
        </div>
      );
    });
  }, [question.choices]);

  const handleClickAddChoice = React.useCallback(
    (_: any) => {
      setQuestions(oldVals => {
        const newChoices = [...oldVals[idx].choices, { label: "" }];
        const newVals = [...oldVals];

        newVals[idx] = {
          ...newVals[idx],
          choices: newChoices,
        };
        return newVals;
      });
    },
    [idx, setQuestions]
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputSection}>
        <p>{i18n.label}</p>
        <textarea name="label" onChange={ev => handleChangeQuestions(idx, ev)} rows={2} />
      </div>
      <div className={styles.inputSection}>
        <p>{i18n.question_type}</p>
        <select name="type" onChange={ev => handleChangeQuestions(idx, ev)}>
          <option>{i18n.multiple_choice}</option>
          {/* <option>{i18n.checkboxes}</option> */}
        </select>
      </div>
      <div className={styles.inputSection}>
        <p>{i18n.choices}</p>
        <div>{choicesElem}</div>
      </div>
      <div className={styles.btnRow}>
        <Button variant="transparent_black_1" name="add_choice" handleClick={handleClickAddChoice}>
          {i18n.add_choice}
        </Button>
      </div>
    </div>
  );
};

export default QuestionBlock;

export interface QuestionBlockProps {
  question: PollQuestion;
  idx: number;
  handleChangeQuestions: (idx: number, ev: React.ChangeEvent) => void;
  setQuestions: React.Dispatch<React.SetStateAction<PollQuestion[]>>;
}

export interface PollQuestion {
  type: "multiple_choice" | "checkboxes" | "text";
  label: string;
  required: boolean;
  choices: PollQuestionChoice[];
}

export interface PollQuestionChoice {
  label: string;
}
