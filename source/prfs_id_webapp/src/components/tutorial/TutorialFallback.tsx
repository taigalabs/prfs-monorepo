import React from "react";
import Tutorial1MD from "@/components/tutorial_contents/tutorial_1.mdx";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import cn from "classnames";

import styles from "./Tutorial.module.scss";
import MarkdownWrapper from "./MarkdownWrapper";
import { getI18N } from "@/i18n/get_i18n";

const TutorialFallback: React.FC<TutorialProps> = async ({ bigTopMargin }) => {
  const i18n = await getI18N();

  return (
    <>
      <div className={styles.placeholder} />
      <div className={cn(styles.wrapper, { [styles.bigTopMargin]: bigTopMargin })}>
        <div className={styles.header}>
          <p className={styles.progress}>{i18n.steps}</p>
          <button>{i18n.close}</button>
        </div>
        <div className={styles.body}>
          <MarkdownWrapper>
            <Tutorial1MD />
          </MarkdownWrapper>
          <div className={styles.btnRow}>
            <Button variant="transparent_aqua_blue_1">{i18n.prev}</Button>
            <Button variant="aqua_blue_1">{i18n.next}</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TutorialFallback;

export interface TutorialProps {
  bigTopMargin?: boolean;
}

export interface StageProps {
  step: number;
}
