import React from "react";
import JSONbig from "json-bigint";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import { SpartanMerkleProof } from "@taigalabs/prfs-proof-interface";
import cn from "classnames";
import { RiEqualizerLine } from "@react-icons/all-files/ri/RiEqualizerLine";
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
import Fade from "@taigalabs/prfs-react-lib/src/fade/Fade";

import styles from "./MerkleProofRaw.module.scss";
import { i18nContext } from "@/i18n/context";

const MerkleProofRawModal: React.FC<MerkleProofRawModalProps> = ({
  prfsSet,
  circuitInput,
  handleClickRawSubmit,
  setIsOpen,
}) => {
  const i18n = React.useContext(i18nContext);
  const [walletAddr, setWalletAddr] = React.useState("");
  const [value, setValue] = React.useState<SpartanMerkleProof>();
  const [merkleProofValue, setMerkleProofValue] = React.useState("");

  React.useEffect(() => {
    const v = JSONbig.stringify(value, undefined, 2);
    setMerkleProofValue(v);
  }, [value, setMerkleProofValue]);

  const handleClickCancel = React.useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const extendedHandleClickSubmit = React.useCallback(() => {
    if (value) {
      handleClickRawSubmit(value);
      setIsOpen(false);
    }
  }, [value, handleClickRawSubmit]);

  return (
    <div className={styles.wrapper}>
      {prfsSet ? (
        <>
          <div className={styles.header}>
            <p>{i18n.type_merkle_proof}</p>
          </div>
          <div className={styles.row}>
            <div>
              <span>
                {i18n.merkle_proof}
                {" - "}
              </span>
              <span> {prfsSet?.label}</span>
            </div>
            <textarea
              className={styles.merkleProofInput}
              value="This is currently not supported"
              readOnly
            />
          </div>
          <div className={styles.dialogBtnRow}>
            <Button variant="transparent_black_1" handleClick={extendedHandleClickSubmit}>
              {i18n.submit.toUpperCase()}
            </Button>
            <Button variant="transparent_black_1" handleClick={handleClickCancel}>
              {i18n.cancel.toUpperCase()}
            </Button>
          </div>
        </>
      ) : (
        i18n.loading
      )}
    </div>
  );
};

const MerkleProofRaw: React.FC<MerkleProofRawProps> = ({
  prfsSet,
  circuitInput,
  handleClickRawSubmit,
}) => {
  const i18n = React.useContext(i18nContext);
  const [isOpen, setIsOpen] = React.useState(false);
  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
  });
  const click = useClick(context);
  const role = useRole(context);
  const dismiss = useDismiss(context, { outsidePressEvent: "mousedown" });
  const { getReferenceProps, getFloatingProps } = useInteractions([click, role, dismiss]);
  const headingId = useId();
  const descriptionId = useId();

  return (
    <>
      <button
        className={styles.rawBtn}
        type="button"
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        {/* <RiEqualizerLine /> */}
        {i18n.raw}
      </button>
      <FloatingPortal>
        {isOpen && (
          <FloatingOverlay style={{ zIndex: 20 }}>
            <Fade className={styles.fadeOverlay}>
              <FloatingFocusManager context={context}>
                <div
                  className={styles.dialog}
                  ref={refs.setFloating}
                  aria-labelledby={headingId}
                  aria-describedby={descriptionId}
                  {...getFloatingProps()}
                >
                  <MerkleProofRawModal
                    prfsSet={prfsSet}
                    circuitInput={circuitInput}
                    handleClickRawSubmit={handleClickRawSubmit}
                    setIsOpen={setIsOpen}
                  />
                </div>
              </FloatingFocusManager>
            </Fade>
          </FloatingOverlay>
        )}
      </FloatingPortal>
    </>
  );
};

export default MerkleProofRaw;

export interface MerkleProofRawProps {
  prfsSet: PrfsSet | undefined;
  circuitInput: CircuitInput;
  handleClickRawSubmit: (merkleProof: SpartanMerkleProof) => void;
  // setIsOpen: (b: boolean) => void;
}

export interface MerkleProofRawModalProps {
  prfsSet: PrfsSet | undefined;
  circuitInput: CircuitInput;
  handleClickRawSubmit: (merkleProof: SpartanMerkleProof) => void;
  setIsOpen: (b: boolean) => void;
}
