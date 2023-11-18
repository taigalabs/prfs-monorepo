import React from "react";
import cn from "classnames";
import {
  offset as offset_fn,
  useFloating,
  useClick,
  useInteractions,
  useDismiss,
  flip,
  Placement,
} from "@floating-ui/react";
import { IoMdArrowDropdown } from "@react-icons/all-files/io/IoMdArrowDropdown";

import Fade from "../fade/Fade";
import styles from "./SaveProofPopover.module.scss";
import Button from "../button/Button";
import { i18nContext } from "../contexts/i18nContext";
// import { connectSnap, detectSnaps, getSnap, isLocalSnap, isFlask as isMetasMaskFlask } from "../modules/snap/utils";
// import { defaultSnapOrigin } from "../modules/snap/config";
import Snaps from "./Snaps";

export const sendHello = async () => {
  // await window.ethereum.request({
  //   method: "wallet_invokeSnap",
  //   params: { snapId: defaultSnapOrigin, request: { method: "hello" } },
  // });
};

function SaveProofPopover({ placement, offset, variant }: SaveProofPopoverProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const i18n = React.useContext(i18nContext);
  const { refs, floatingStyles, context } = useFloating({
    placement: placement ? placement : "bottom-start",
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [flip(), offset_fn(offset ? offset : 3)],
  });
  const dismiss = useDismiss(context);
  const click = useClick(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

  // const [isFlask, setIsFlask] = React.useState(false);
  // const [isSnapEnabled, setIsSnapEnabled] = React.useState(false);
  // const [isSnapsDetected, setIsSnapsDetected] = React.useState(false);

  // const isMetaMaskReady = React.useMemo(() => {
  //   return isLocalSnap(defaultSnapOrigin) ? isFlask : isSnapsDetected;
  // }, [isFlask, isSnapsDetected]);

  // React.useEffect(() => {
  //   const setSnapsCompatibility = async () => {
  //     const res = await detectSnaps()
  //     setIsSnapsDetected(res);
  //   };

  //   const checkIfFlask = async () => {
  //     const res = await isMetasMaskFlask();
  //     setIsFlask(res);
  //   };

  //   setSnapsCompatibility().catch(console.error);
  //   checkIfFlask();
  // }, [window.ethereum, setIsSnapsDetected, setIsFlask]);

  // React.useEffect(() => {
  //   async function fn() {
  //     const win = window as any;

  //     try {
  //       if (win.ethereum) {
  //         console.log(111);

  //         await connectSnap();
  //         const installedSnap = await getSnap();

  //         console.log('installedSnap');

  //         // const res = await win.ethereum.request({
  //         //   method: "wallet_invokeSnap",
  //         //   params: { snapId: defaultSnapOrigin, request: { method: "hello" } },
  //         // });
  //       }
  //     } catch (err) {
  //       console.error(44, err);
  //     }
  //   }

  //   fn().then();
  // }, [setIsSnapEnabled]);

  // console.log(123, isFlask, isMetaMaskReady, isSnapsDetected, isSnapEnabled);

  return (
    <>
      <div
        className={cn({ [styles.base]: true, [styles.isOpen]: isOpen })}
        ref={refs.setReference}
        {...getReferenceProps()}
        role="button"
      >
        <button>
          <span>{i18n.save}</span>
          <IoMdArrowDropdown />
        </button>
      </div>
      {isOpen && (
        <div
          className={cn(styles.popover)}
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          <ul className={styles.menuList}>
            <li>
              <Snaps />
              {/* <button disabled={isSnapEnabled}> */}
              {/*   <span>Snap</span> */}
              {/*   <span className={styles.beta}>{i18n.beta}</span> */}
              {/* </button> */}
            </li>
          </ul>
        </div>
      )}
    </>
  );
}

export default SaveProofPopover;

export interface SaveProofPopoverProps {
  variant?: "transparent_blue_1" | "transparent_black_1";
  offset?: number;
  placement?: Placement;
}
