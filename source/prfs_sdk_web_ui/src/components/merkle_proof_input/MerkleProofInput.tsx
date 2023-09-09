import React from "react";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { Msg, sendMsgToParent } from "@taigalabs/prfs-sdk-web";
import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";
import { SpartanMerkleProof } from "@taigalabs/prfs-driver-spartan-js";
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
import { setInnerOpacity, setInnerPos } from "@/state/uiReducer";

const MerkleProofInput: React.FC<MerkleProofInputProps> = ({
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
        dispatch(setInnerOpacity(0));

        const duration = 300;
        const { top, left } = await sendMsgToParent(
          new Msg("OPEN_DIALOG", {
            duration,
          })
        );

        dispatch(
          setInnerPos({
            top,
            left,
          })
        );

        window.setTimeout(() => {
          setIsOpen(isOpen => !isOpen);
          dispatch(setInnerOpacity(1));
        }, duration);

        return;
      } else {
        dispatch(
          setInnerPos({
            top: 0,
            left: 0,
          })
        );

        await sendMsgToParent(new Msg("CLOSE_DIALOG", undefined));
        setIsOpen(isOpen => !isOpen);
        return;
      }
    } catch (err) {
      console.error(err);
    }
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

  const handleClickSubmit = React.useCallback(
    (merkleProof: SpartanMerkleProof) => {
      setFormValues((prevVals: any) => {
        return {
          ...prevVals,
          [circuitInput.name]: merkleProof,
        };
      });

      toggleDialog();
    },
    [setFormValues, toggleDialog]
  );

  return (
    prfsSet && (
      <div className={styles.wrapper}>
        <input placeholder={`${i18n.set} - ${prfsSet.label}`} value={displayValue} readOnly />
        <div className={styles.btnGroup}>
          <div>
            <div ref={refs.setReference} {...getReferenceProps()}>
              <button>{i18n.create}</button>
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
                          value={value}
                          circuitInput={circuitInput}
                          handleClickSubmit={handleClickSubmit}
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
  circuitInput: CircuitInput;
  value: SpartanMerkleProof | undefined;
  setFormValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}
