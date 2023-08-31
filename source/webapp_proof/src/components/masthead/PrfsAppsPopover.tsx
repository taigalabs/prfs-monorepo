import React from "react";
import cn from "classnames";
import * as prfsApi from "@taigalabs/prfs-api-js";
import Popover from "@taigalabs/prfs-react-components/src/popover/Popover";
import { IconMathPi } from "@tabler/icons-react";
import ForestIcon from "@taigalabs/prfs-react-components/src/material_icons/Forest";
import HowToVoteIcon from "@taigalabs/prfs-react-components/src/material_icons/HowToVote";
import GroupIcon from "@taigalabs/prfs-react-components/src/material_icons/Group";

import styles from "./PrfsAppsPopover.module.scss";
import { i18nContext } from "@/contexts/i18n";
import IconButton from "@taigalabs/prfs-react-components/src/icon_button/IconButton";

const Modal: React.FC<MerkleProofModalProps> = ({}) => {
  const i18n = React.useContext(i18nContext);

  return (
    <ul className={styles.modal}>
      <li>
        <div className={styles.appItem}>
          <IconMathPi />
          <span>{i18n.proof}</span>
        </div>
      </li>
      <li className={styles.inactive}>
        <div className={styles.appItem}>
          <ForestIcon />
          <span>{i18n.forest}</span>
        </div>
      </li>
      <li className={styles.inactive}>
        <div className={styles.appItem}>
          <HowToVoteIcon />
          <span>{i18n.vote}</span>
        </div>
      </li>
      <li className={styles.inactive}>
        <div className={styles.appItem}>
          <GroupIcon />
          <span>{i18n.enrollment}</span>
        </div>
      </li>
    </ul>
  );
};

const PrfsAppsPopover: React.FC<PrfsAppsPopoverProps> = ({}) => {
  const i18n = React.useContext(i18nContext);

  const createBase = React.useCallback((isOpen: boolean) => {
    return (
      <div>
        <IconButton
          className={cn({
            [styles.isOpen]: isOpen,
          })}
          variant="hamburger"
        />
      </div>
    );
  }, []);

  const createPopover = React.useCallback(
    (setIsOpen: React.Dispatch<React.SetStateAction<any>>) => {
      return <Modal setIsOpen={setIsOpen} />;
    },
    []
  );

  return (
    <div className={styles.wrapper}>
      <Popover
        createBase={createBase}
        createPopover={createPopover}
        offset={10}
        popoverClassName={styles.popoverWrapper}
      />
    </div>
  );
};

export default PrfsAppsPopover;

export interface PrfsAppsPopoverProps {}

export interface MerkleProofModalProps {
  setIsOpen: React.Dispatch<React.SetStateAction<any>>;
}
