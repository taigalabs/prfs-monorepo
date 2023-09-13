import React from "react";
import cn from "classnames";
import Link from "next/link";

import styles from "./PrfsAppsPopover.module.scss";
import IconButton from "../icon_button/IconButton";
import Popover from "../popover/Popover";
import { TbMathPi } from "../tabler_icons/TbMathPi";
import MiForest from "../material_icons/MiForest";
import MiHowToVote from "../material_icons/MiHowToVote";

const i18n = {
  proof: "Proof",
  poll: "Poll",
  console: "Console",
};

const Modal: React.FC<MerkleProofModalProps> = ({
  webappProofEndpoint,
  webappConsoleEndpoint,
  webappPollEndpoint,
}) => {
  return (
    <ul className={styles.modal}>
      <li>
        <Link className={styles.appEntry} href={webappProofEndpoint}>
          <TbMathPi />
          <span>{i18n.proof}</span>
        </Link>
      </li>
      <li>
        <Link className={styles.appEntry} href={webappConsoleEndpoint}>
          <span>{i18n.console}</span>
        </Link>
      </li>
      <li>
        <Link className={styles.appEntry} href={webappPollEndpoint}>
          <MiHowToVote />
          <span>{i18n.poll}</span>
        </Link>
      </li>
    </ul>
  );
};

const PrfsAppsPopover: React.FC<PrfsAppsPopoverProps> = ({
  webappProofEndpoint,
  webappConsoleEndpoint,
  webappPollEndpoint,
}) => {
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
      return (
        <Modal
          setIsOpen={setIsOpen}
          webappProofEndpoint={webappProofEndpoint}
          webappConsoleEndpoint={webappConsoleEndpoint}
          webappPollEndpoint={webappPollEndpoint}
        />
      );
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

export interface PrfsAppsPopoverProps {
  webappPollEndpoint: string;
  webappProofEndpoint: string;
  webappConsoleEndpoint: string;
}

export interface MerkleProofModalProps {
  setIsOpen: React.Dispatch<React.SetStateAction<any>>;
  webappPollEndpoint: string;
  webappProofEndpoint: string;
  webappConsoleEndpoint: string;
}
