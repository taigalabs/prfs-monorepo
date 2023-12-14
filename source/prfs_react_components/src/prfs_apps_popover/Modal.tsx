import React, { useId } from "react";
import cn from "classnames";
import { GrMonitor } from "@react-icons/all-files/gr/GrMonitor";
import { FaVoteYea } from "@react-icons/all-files/fa/FaVoteYea";
import { BsThreeDots } from "@react-icons/all-files/bs/BsThreeDots";

import {
  FloatingFocusManager,
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from "@floating-ui/react";

import styles from "./Modal.module.scss";
import { TbMathPi } from "../tabler_icons/TbMathPi";
import { TbCertificate } from "../tabler_icons/TbCertificate";
import { i18nContext } from "../i18n/i18nContext";
import Tooltip from "../tooltip/Tooltip";

export const PrfsAppsPopoverUl: React.FC<PrfsAppsPopoverLiProps> = ({ children }) => {
  return <ul className={styles.appList}>{children}</ul>;
};

export const PrfsAppsPopoverLi: React.FC<PrfsAppsPopoverLiProps> = ({ children }) => {
  return <li className={styles.appItem}>{children}</li>;
};

const Modal: React.FC<ModalProps> = ({ children }) => {
  const i18n = React.useContext(i18nContext);
  // const { tutorialUrl } = React.useMemo(() => {
  //   return {
  //     tutorialUrl: `${webappProofEndpoint}?tutorial_id=simple_hash`,
  //   };
  // }, [webappProofEndpoint]);

  return (
    <div className={styles.wrapper}>
      <ul className={styles.auxMenu}>
        {/* <li> */}
        {/*   <a className={styles.appItem} href={webappProofEndpoint}> */}
        {/*     <span>{i18n.documentation}</span> */}
        {/*   </a> */}
        {/* </li> */}
        {/* <li> */}
        {/*   <a className={styles.appItem} href={tutorialUrl}> */}
        {/*     <span>{i18n.start_tutorial}</span> */}
        {/*   </a> */}
        {/* </li> */}
      </ul>
      <ul className={styles.appMenu}>
        {children}
        {/* <li> */}
        {/*   <a className={styles.appItem} href={webappProofEndpoint}> */}
        {/*     <TbCertificate /> */}
        {/*     <span>{i18n.account_verification}</span> */}
        {/*   </a> */}
        {/* </li> */}
        {/* <li> */}
        {/*   <a className={styles.appItem} href={webappProofEndpoint}> */}
        {/*     <TbMathPi /> */}
        {/*     <span>{i18n.proof}</span> */}
        {/*   </a> */}
        {/* </li> */}
        {/* <li> */}
        {/*   <a className={styles.appItem} href={webappConsoleEndpoint}> */}
        {/*     <GrMonitor /> */}
        {/*     <span>{i18n.console}</span> */}
        {/*   </a> */}
        {/* </li> */}
      </ul>
    </div>
  );
};

export default Modal;

export interface ModalProps {
  setIsOpen: React.Dispatch<React.SetStateAction<any>>;
  children: React.ReactNode;
  // webappPollEndpoint: string;
  // webappProofEndpoint: string;
  // webappConsoleEndpoint: string;
}

export interface PrfsAppsPopoverLiProps {
  children: React.ReactNode;
}
