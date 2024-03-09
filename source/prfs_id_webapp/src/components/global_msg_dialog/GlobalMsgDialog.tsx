"use client";

import React from "react";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import Fade from "@taigalabs/prfs-react-lib/src/fade/Fade";
import {
  useFloating,
  useDismiss,
  useRole,
  useClick,
  useInteractions,
  useId,
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
} from "@floating-ui/react";

import styles from "./GlobalMsgDialog.module.scss";
import { useI18N } from "@/i18n/context";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { removeGlobalMsg } from "@/state/globalMsgReducer";

const GlobalMsgDialog: React.FC<PrfsIdErrorDialogProps> = ({}) => {
  const i18n = useI18N();
  const [isOpen, setIsOpen] = React.useState(true);
  const globalMsg = useAppSelector(state => state.globalMsg.msg?.message);
  const dispatch = useAppDispatch();
  const handleClickClose = React.useCallback(() => {
    dispatch(removeGlobalMsg());
  }, [dispatch]);

  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: handleClickClose,
  });
  const headingId = useId();
  const descriptionId = useId();
  const click = useClick(context);
  const role = useRole(context);
  const dismiss = useDismiss(context, {
    outsidePressEvent: "mousedown",
    enabled: false,
  });
  const { getReferenceProps, getFloatingProps } = useInteractions([click, role, dismiss]);

  return (
    <>
      {/* <div ref={refs.setReference} {...getReferenceProps()}></div> */}
      <FloatingPortal>
        {globalMsg && (
          <FloatingOverlay className={styles.overlay} lockScroll>
            <Fade>
              <FloatingFocusManager context={context}>
                <div
                  className={styles.dialog}
                  ref={refs.setFloating}
                  aria-labelledby={headingId}
                  aria-describedby={descriptionId}
                  {...getFloatingProps()}
                >
                  <div className={styles.msg}>{globalMsg}</div>
                  <div className={styles.btnRow}>
                    {/* <Button */}
                    {/*   variant="transparent_blue_2" */}
                    {/*   className={styles.closeBtn} */}
                    {/*   handleClick={handleClickReload} */}
                    {/* > */}
                    {/*   {i18n.reload.toUpperCase()} */}
                    {/* </Button> */}
                    <Button
                      variant="transparent_blue_2"
                      className={styles.closeBtn}
                      handleClick={handleClickClose}
                    >
                      {i18n.close_window.toUpperCase()}
                    </Button>
                  </div>
                </div>
              </FloatingFocusManager>
            </Fade>
          </FloatingOverlay>
        )}
      </FloatingPortal>
    </>
  );
};

export default GlobalMsgDialog;

export interface PrfsIdErrorDialogProps {}
