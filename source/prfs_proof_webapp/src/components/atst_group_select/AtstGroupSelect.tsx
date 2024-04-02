import React from "react";
import cn from "classnames";
import { IoMdArrowDropdown } from "@react-icons/all-files/io/IoMdArrowDropdown";
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
import { useI18N } from "@/i18n/use_i18n";
import AtstGroupModal from "./AtstGroupModal";
import { PrfsAtstGroup } from "@taigalabs/prfs-entities/bindings/PrfsAtstGroup";

const AtstGroupSelect: React.FC<ClaimSecretItemProps> = ({}) => {
  const i18n = useI18N();

  const [isOpen, setIsOpen] = React.useState(false);
  const [atstGroup, setAtstGroup] = React.useState<PrfsAtstGroup | null>(null);
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

  const handleSelectGroup = React.useCallback(
    (atstGroup: PrfsAtstGroup) => {
      setAtstGroup(atstGroup);
    },
    [setAtstGroup],
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.base} ref={refs.setReference} {...getReferenceProps()}>
        <div className={styles.selectBase}>
          {atstGroup ? (
            atstGroup.label
          ) : (
            <>
              {i18n.choose_group}
              <IoMdArrowDropdown />
            </>
          )}
        </div>
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
            <AtstGroupModal handleSelectGroup={handleSelectGroup} setIsOpen={setIsOpen} />
          </div>
        </FloatingFocusManager>
      )}
    </div>
  );
};

export default AtstGroupSelect;

export interface ClaimSecretItemProps {}
