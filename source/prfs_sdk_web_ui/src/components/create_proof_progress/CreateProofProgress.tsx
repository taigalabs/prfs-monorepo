import React from "react";
import cn from "classnames";

import styles from "./CreateProofProgress.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Fade from "@taigalabs/prfs-react-components/src/fade/Fade";

const CreateProofProgress: React.FC<CreateProofProgressProps> = ({ terminalLog, isCompleted }) => {
  const i18n = React.useContext(i18nContext);

  React.useEffect(() => {
    // console.log(55, terminalLog);
  }, [terminalLog]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.guide}>
        <p className={styles.title}>{i18n.proof_creation_title}</p>
        <p>
          <button onClick={() => {}}>Abort now</button> if you are running other CPU-intensive
          tasks. Do not refresh the page
        </p>
        <p>{i18n.start_create_proof_guide_2}</p>
      </div>
      <div
        className={cn({
          [styles.terminal]: true,
          [styles.isCompleted]: isCompleted,
        })}
      >
        {terminalLog}
      </div>
    </div>
  );
};

export default CreateProofProgress;

export interface CreateProofProgressProps {
  terminalLog: React.ReactNode;
  isCompleted: boolean;
}
