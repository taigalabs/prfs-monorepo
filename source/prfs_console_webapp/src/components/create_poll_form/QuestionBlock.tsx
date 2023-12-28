import React from "react";
import cn from "classnames";
import Link from "next/link";
import { IoAddCircleOutline } from "@react-icons/all-files/io5/IoAddCircleOutline";
import { PollQuestion } from "@taigalabs/prfs-entities/bindings/PollQuestion";

import styles from "./QuestionBlock.module.scss";
import { i18nContext } from "@/i18n/context";
import { PollQuestionType } from "@taigalabs/prfs-entities/bindings/PollQuestionType";

const QuestionBlock: React.FC<QuestionBlockProps> = ({
  question,
  idx,
  handleChangeQuestions,
  setQuestions,
}) => {
  const i18n = React.useContext(i18nContext);

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
    [setQuestions],
  );

  const choicesElem = React.useMemo(() => {
    return question.choices?.map((choice, idx) => {
      return (
        <div className={cn(styles.choice)} key={idx}>
          <div className={styles.symbol} />
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
    [idx, setQuestions],
  );

  const handleChangeQuestionsExtended = React.useCallback(
    (ev: React.ChangeEvent) => {
      handleChangeQuestions(idx, ev);
    },
    [idx, handleChangeQuestions],
  );

  return (
    <div className={styles.wrapper}>
      <p className={styles.questionNo}>{idx + 1}</p>
      <div className={styles.main}>
        <div className={styles.topRow}>
          <div className={styles.label}>
            <textarea
              name="label"
              value={question.label}
              onChange={handleChangeQuestionsExtended}
              rows={2}
            />
          </div>
          <div className={styles.questionType}>
            <select name="type" onChange={handleChangeQuestionsExtended} value={question.type}>
              <option value={"MultipleChoice" as PollQuestionType}>{i18n.multiple_choice}</option>
              {/* <option>{i18n.checkboxes}</option> */}
            </select>
          </div>
        </div>
        <div className={styles.inputSection}>
          <div>{choicesElem}</div>
        </div>
        <div className={styles.btnRow}>
          <button name="add_choice" onClick={handleClickAddChoice}>
            <IoAddCircleOutline />
          </button>
        </div>
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
