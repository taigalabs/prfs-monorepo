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

import styles from "./PrfsAppsPopover.module.scss";
import { TbMathPi } from "../tabler_icons/TbMathPi";
import { TbCertificate } from "../tabler_icons/TbCertificate";
import { i18nContext } from "../i18n/i18nContext";
import Tooltip from "../tooltip/Tooltip";
import Modal from "./Modal";

// const Modal: React.FC<MerkleProofModalProps> = ({
//   webappProofEndpoint,
//   webappConsoleEndpoint,
//   children,
// }) => {
//   const i18n = React.useContext(i18nContext);
//   const { tutorialUrl } = React.useMemo(() => {
//     return {
//       tutorialUrl: `${webappProofEndpoint}?tutorial_id=simple_hash`,
//     };
//   }, [webappProofEndpoint]);

//   return (
//     <div className={styles.modal}>
//       <ul className={styles.auxMenu}>
//         <li>
//           <a className={styles.appItem} href={webappProofEndpoint}>
//             <span>{i18n.documentation}</span>
//           </a>
//         </li>
//         <li>
//           <a className={styles.appItem} href={tutorialUrl}>
//             <span>{i18n.start_tutorial}</span>
//           </a>
//         </li>
//       </ul>
//       <ul className={styles.appMenu}>
//         {children}
//         {/* <li> */}
//         {/*   <a className={styles.appItem} href={webappProofEndpoint}> */}
//         {/*     <TbCertificate /> */}
//         {/*     <span>{i18n.account_verification}</span> */}
//         {/*   </a> */}
//         {/* </li> */}
//         {/* <li> */}
//         {/*   <a className={styles.appItem} href={webappProofEndpoint}> */}
//         {/*     <TbMathPi /> */}
//         {/*     <span>{i18n.proof}</span> */}
//         {/*   </a> */}
//         {/* </li> */}
//         {/* <li> */}
//         {/*   <a className={styles.appItem} href={webappConsoleEndpoint}> */}
//         {/*     <GrMonitor /> */}
//         {/*     <span>{i18n.console}</span> */}
//         {/*   </a> */}
//         {/* </li> */}
//       </ul>
//     </div>
//   );
// };

const PrfsAppsPopover: React.FC<PrfsAppsPopoverProps> = ({
  className,
  children,
  isOpenClassName,
  webappProofEndpoint,
  webappConsoleEndpoint,
  webappPollEndpoint,
  tooltip,
  zIndex,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "bottom-end",
    middleware: [offset(10), flip({ fallbackAxisSideDirection: "end" }), shift()],
    whileElementsMounted: autoUpdate,
  });
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);
  const headingId = useId();

  return (
    <>
      <button
        className={cn(styles.base, {
          [styles.isOpen]: isOpen,
          [className!]: !!className,
          [isOpenClassName!]: !!isOpenClassName && isOpen,
        })}
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        {tooltip ? (
          <Tooltip label={tooltip}>
            <BsThreeDots />
          </Tooltip>
        ) : (
          <BsThreeDots />
        )}
      </button>
      {isOpen && (
        <FloatingFocusManager context={context} modal={false}>
          <div
            className={styles.popoverWrapper}
            ref={refs.setFloating}
            style={floatingStyles}
            aria-labelledby={headingId}
            {...getFloatingProps()}
          >
            <Modal
              setIsOpen={setIsOpen}
              webappProofEndpoint={webappProofEndpoint}
              webappConsoleEndpoint={webappConsoleEndpoint}
              webappPollEndpoint={webappPollEndpoint}
            >
              {children}
            </Modal>
          </div>
        </FloatingFocusManager>
      )}
    </>
  );
};

export default PrfsAppsPopover;

export interface PrfsAppsPopoverProps {
  className?: string;
  isOpenClassName?: string;
  webappPollEndpoint: string;
  webappProofEndpoint: string;
  webappConsoleEndpoint: string;
  zIndex?: number;
  tooltip?: string;
  children: React.ReactNode;
}

// export interface MerkleProofModalProps {
//   setIsOpen: React.Dispatch<React.SetStateAction<any>>;
//   children: React.ReactNode;
//   webappPollEndpoint: string;
//   webappProofEndpoint: string;
//   webappConsoleEndpoint: string;
// }
