import React from "react";
import cn from "classnames";
import Popover from "@taigalabs/prfs-react-components/src/popover/Popover";
import { TbMathPi } from "@taigalabs/prfs-react-components/src/tabler_icons/TbMathPi";
import MiForest from "@taigalabs/prfs-react-components/src/material_icons/MiForest";
import MiHowToVote from "@taigalabs/prfs-react-components/src/material_icons/MiHowToVote";
import Link from "next/link";

import styles from "./PrfsAppsPopover.module.scss";
import { i18nContext } from "@/contexts/i18n";
import IconButton from "@taigalabs/prfs-react-components/src/icon_button/IconButton";

const Modal: React.FC<MerkleProofModalProps> = ({}) => {
  const i18n = React.useContext(i18nContext);

  return (
    <ul className={styles.modal}>
      <li>
        <Link className={styles.appEntry} href={process.env.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}>
          <TbMathPi />
          <span>{i18n.proof}</span>
        </Link>
      </li>
      <li className={styles.inactive}>
        <div className={styles.appEntry}>
          <MiHowToVote />
          <span>{i18n.vote}</span>
        </div>
      </li>
      <li className={styles.inactive}>
        <div className={styles.appEntry}>
          <MiForest />
          <span>{i18n.forest}</span>
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
