import React from "react";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { Msg, sendMsgToParent } from "@taigalabs/prfs-sdk-web";
import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";
import { SpartanMerkleProof } from "@taigalabs/prfs-driver-spartan-js";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
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
import Fade from "@taigalabs/prfs-react-components/src/fade/Fade";

import styles from "./MerkleProofInput.module.scss";
import MerkleProofDialog from "./MerkleProofDialog";
import { i18nContext } from "@/contexts/i18n";
import { useAppDispatch } from "@/state/hooks";
import { setInnerPos } from "@/state/uiReducer";

const MerkleProofInput: React.FC<MerkleProofInputProps> = ({
  walletAddr,
  circuitInput,
  value,
  setFormValues,
}) => {
  const i18n = React.useContext(i18nContext);
  const [prfsSet, setPrfsSet] = React.useState<PrfsSet>();
  const [isOpen, setIsOpen] = React.useState(false);
  const dispatch = useAppDispatch();

  const toggleDialog = React.useCallback(async () => {
    try {
      if (!isOpen) {
        const { top, left } = await sendMsgToParent(new Msg("OPEN_DIALOG", undefined));

        dispatch(
          setInnerPos({
            top,
            left,
          })
        );
      } else {
        dispatch(
          setInnerPos({
            top: 0,
            left: 0,
          })
        );
        await sendMsgToParent(new Msg("CLOSE_DIALOG", undefined));
      }
    } catch (err) {
      console.error(err);
    }
    setIsOpen(isOpen => !isOpen);
  }, [isOpen, setIsOpen]);

  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: toggleDialog,
  });

  const click = useClick(context);
  const role = useRole(context);
  const dismiss = useDismiss(context, { outsidePressEvent: "mousedown" });

  const { getReferenceProps, getFloatingProps } = useInteractions([click, role, dismiss]);

  const headingId = useId();
  const descriptionId = useId();

  React.useEffect(() => {
    async function fn() {
      if (circuitInput.ref_type === "PRFS_SET") {
        if (!circuitInput.ref_value) {
          console.error("Prfs set ref value is not provided");
          return;
        }

        const { payload } = await prfsApi2("get_prfs_set_by_set_id", {
          set_id: circuitInput.ref_value,
        });

        setPrfsSet(payload.prfs_set);
      } else {
        console.error("Prfs set not found");
      }
    }
    fn().then();
  }, [circuitInput, setPrfsSet]);

  const displayValue = React.useMemo(() => {
    if (value) {
      const { root, pathIndices, siblings } = value;
      const rt = `Root: ${root.toString().substring(0, 6)}..`;
      const paths = `Paths[${pathIndices.length}]: ${pathIndices.slice(0, 6).join(",")}..`;
      const sibs = `Siblings[${siblings.length}]`;
      return `${rt} / ${paths} / ${sibs}`;
    }

    return "";
  }, [value]);

  return (
    prfsSet && (
      <div className={styles.wrapper}>
        <input placeholder={`${i18n.set} - ${prfsSet.label}`} value={displayValue} readOnly />
        <div className={styles.btnGroup}>
          <div>
            <div ref={refs.setReference} {...getReferenceProps()}>
              <Button variant="white_gray_1">{i18n.create}</Button>
            </div>
            <FloatingPortal>
              {isOpen && (
                <Fade>
                  <FloatingOverlay className={styles.dialogOverlay} lockScroll>
                    <FloatingFocusManager context={context}>
                      <div
                        className={styles.dialog}
                        ref={refs.setFloating}
                        aria-labelledby={headingId}
                        aria-describedby={descriptionId}
                        {...getFloatingProps()}
                      >
                        <MerkleProofDialog
                          prfsSet={prfsSet}
                          walletAddr={walletAddr}
                          circuitInput={circuitInput}
                          setFormValues={setFormValues}
                        />
                      </div>
                    </FloatingFocusManager>
                  </FloatingOverlay>
                </Fade>
              )}
            </FloatingPortal>
          </div>
        </div>
      </div>
    )
  );
};

export default MerkleProofInput;

export interface MerkleProofInputProps {
  walletAddr: string;
  circuitInput: CircuitInput;
  value: SpartanMerkleProof | undefined;
  setFormValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}
