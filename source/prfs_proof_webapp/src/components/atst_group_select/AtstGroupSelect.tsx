import React from "react";
import cn from "classnames";
import {
  FloatingFocusManager,
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useId,
  useInteractions,
  useRole,
} from "@floating-ui/react";

import styles from "./AtstGroupSelect.module.scss";
import { useAppDispatch } from "@/state/hooks";
import PrfsIdSessionDialog from "@taigalabs/prfs-react-lib/src/prfs_id_session_dialog/PrfsIdSessionDialog";
import { PrfsIdSession } from "@taigalabs/prfs-entities/bindings/PrfsIdSession";
import { setGlobalError } from "@taigalabs/prfs-react-lib/src/global_error_reducer";
import { useI18N } from "@/i18n/use_i18n";
import AtstGroupModal from "./AtstGroupModal";

const Modal: React.FC = () => {
  return <div>Modal</div>;
};

const AtstGroupSelect: React.FC<ClaimSecretItemProps> = ({}) => {
  const i18n = useI18N();

  const [isOpen, setIsOpen] = React.useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "bottom-end",
    middleware: [offset(0), flip({ fallbackAxisSideDirection: "start" }), shift()],
    whileElementsMounted: autoUpdate,
  });
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);
  const headingId = useId();

  return (
    <div className={styles.wrapper}>
      <div className={styles.base} ref={refs.setReference} {...getReferenceProps()}>
        <div className={styles.selectBase}>{i18n.choose_group}</div>
      </div>
      {isOpen && (
        <FloatingFocusManager context={context} modal={false}>
          <div
            className={styles.popoverWrapper}
            ref={refs.setFloating}
            style={floatingStyles}
            aria-labelledby={headingId}
            {...getFloatingProps()}
          >
            <AtstGroupModal />
          </div>
        </FloatingFocusManager>
      )}
    </div>
  );
};

export default AtstGroupSelect;

export interface ClaimSecretItemProps {}
