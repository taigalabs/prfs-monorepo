import React from "react";
import cn from "classnames";

import styles from "./CreateProofProgress.module.scss";
import { i18nContext } from "@/contexts/i18n";

const CreateProofProgress: React.FC<CreateProofProgressProps> = ({ terminalLogElem }) => {
  const i18n = React.useContext(i18nContext);
  const [logCount, setLogCount] = React.useState(0);
  const logRef = React.useRef(null);

  React.useEffect(() => {
    if (terminalLogElem.length !== logCount) {
      if (logRef.current) {
        const div = logRef.current as HTMLDivElement;
        div.scrollTop = div.scrollHeight;
      }

      setLogCount(terminalLogElem.length);
    }
  }, [terminalLogElem, logCount, setLogCount, logRef]);

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
        ref={logRef}
        className={cn({
          [styles.terminal]: true,
        })}
      >
        {terminalLogElem}
      </div>
    </div>
  );
};

export default CreateProofProgress;

export interface CreateProofProgressProps {
  terminalLogElem: React.ReactNode[];
}
