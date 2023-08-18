import React from "react";
import cn from "classnames";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import { makePathIndices, makeSiblingPath } from "@taigalabs/prfs-crypto-js";
import * as prfsApi from "@taigalabs/prfs-api-js";
import {
  ListenClickOutsideMsg,
  StopClickOutsideMsg,
  sendMsgToParent,
} from "@taigalabs/prfs-sdk-web";
import Popover from "@taigalabs/prfs-react-components/src/popover/Popover";
import { TbMathPi } from "react-icons/tb";
import { MdForest, MdOutlineHowToVote, MdGroups } from "react-icons/md";

import styles from "./PrfsAppsPopover.module.scss";
import { i18nContext } from "@/contexts/i18n";
import IconButton from "@taigalabs/prfs-react-components/src/icon_button/IconButton";

const Modal: React.FC<MerkleProofModalProps> = ({}) => {
  const i18n = React.useContext(i18nContext);

  return (
    <ul className={styles.popoverWrapper}>
      <li>
        <div className={styles.appItem}>
          <TbMathPi />
          <span>{i18n.proof.toUpperCase()}</span>
        </div>
      </li>
      <li className={styles.inactive}>
        <div className={styles.appItem}>
          <MdForest />
          <span>{i18n.forest.toUpperCase()}</span>
        </div>
      </li>
      <li className={styles.inactive}>
        <div className={styles.appItem}>
          <MdOutlineHowToVote />
          <span>{i18n.vote.toUpperCase()}</span>
        </div>
      </li>
      <li className={styles.inactive}>
        <div className={styles.appItem}>
          <MdGroups />
          <span>{i18n.enrollment.toUpperCase()}</span>
        </div>
      </li>
    </ul>
  );
};

const PrfsAppsPopover: React.FC<PrfsAppsPopoverProps> = ({}) => {
  const i18n = React.useContext(i18nContext);

  const handleClickCreate = React.useCallback(() => {}, []);

  const createBase = React.useCallback((isOpen: boolean) => {
    return (
      <div>
        <IconButton
          className={cn({
            [styles.isOpen]: isOpen,
          })}
          variant="dots"
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
      <Popover createBase={createBase} createPopover={createPopover} offset={10} />
    </div>
  );
};

export default PrfsAppsPopover;

export interface PrfsAppsPopoverProps {}

export interface MerkleProofModalProps {
  setIsOpen: React.Dispatch<React.SetStateAction<any>>;
}
