import React from "react";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import cn from "classnames";
import { prfsApi2 } from "@taigalabs/prfs-api-js";
import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";
import { RiEqualizerLine } from "@react-icons/all-files/ri/RiEqualizerLine";
import WalletDialog from "@taigalabs/prfs-react-components/src/wallet_dialog/WalletDialog";
import { AiOutlineCheck } from "@react-icons/all-files/ai/AiOutlineCheck";
import { SpartanMerkleProof } from "@taigalabs/prfs-driver-interface";
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
import { makePathIndices, makeSiblingPath } from "@taigalabs/prfs-crypto-js";
import { useMutation } from "@tanstack/react-query";
import { GetPrfsTreeLeafIndicesRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsTreeLeafIndicesRequest";
import { GetPrfsSetBySetIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsSetBySetIdRequest";
import { GetPrfsTreeNodesByPosRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsTreeNodesByPosRequest";

import styles from "./MerkleProofInput.module.scss";
import MerkleProofRawModal from "./MerkleProofRawModal";
import { i18nContext } from "@/contexts/i18n";
import {
  FormError,
  FormInput,
  FormInputTitle,
  FormInputTitleRow,
  InputWrapper,
} from "@/components/form_input/FormInput";
import Button from "@taigalabs/prfs-react-components/src/button/Button";

const ComputedValue: React.FC<ComputedValueProps> = ({ value }) => {
  const val = React.useMemo(() => {
    return (
      "Root: " +
      value.root.toString().substring(0, 6) +
      "... / First sibling: " +
      value.siblings[0].toString().substring(0, 6) +
      "..."
    );
  }, [value]);

  return <div className={styles.computedValue}>{val}</div>;
};

const MerkleProofInput: React.FC<MerkleProofInputProps> = ({
  circuitInput,
  value,
  error,
  setFormErrors,
  setFormValues,
  zIndex,
}) => {
  const i18n = React.useContext(i18nContext);
  const [prfsSet, setPrfsSet] = React.useState<PrfsSet>();
  const [isOpen, setIsOpen] = React.useState(false);
  const [walletAddr, setWalletAddr] = React.useState("");

  const { mutateAsync: GetPrfsTreeLeafIndices } = useMutation({
    mutationFn: (req: GetPrfsTreeLeafIndicesRequest) => {
      return prfsApi2("get_prfs_tree_leaf_indices", req);
    },
  });

  const { mutateAsync: getPrfsSetBySetId } = useMutation({
    mutationFn: (req: GetPrfsSetBySetIdRequest) => {
      return prfsApi2("get_prfs_set_by_set_id", req);
    },
  });

  const { mutateAsync: getPrfsTreeNodesByPosRequest } = useMutation({
    mutationFn: (req: GetPrfsTreeNodesByPosRequest) => {
      return prfsApi2("get_prfs_tree_nodes_by_pos", req);
    },
  });

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

  React.useEffect(() => {
    async function fn() {
      if (circuitInput.ref_type === "PRFS_SET") {
        if (!circuitInput.ref_value) {
          console.error("Prfs set ref value is not provided");
          return;
        }

        const { payload } = await getPrfsSetBySetId({
          set_id: circuitInput.ref_value,
        });

        setPrfsSet(payload.prfs_set);
      } else {
        console.error("Prfs set not found");
      }
    }
    fn().then();
  }, [circuitInput, setPrfsSet, getPrfsSetBySetId]);

  const handleClickRawSubmit = React.useCallback(
    (merkleProof: SpartanMerkleProof) => {
      setFormValues((prevVals: any) => {
        return {
          ...prevVals,
          [circuitInput.name]: merkleProof,
        };
      });

      setIsOpen(false);
    },
    [setFormValues, setIsOpen],
  );

  const handleChangeAddress = React.useCallback(
    async (addr: string) => {
      if (!prfsSet) {
        return;
      }

      if (!addr) {
        return;
      }

      if (error) {
      }

      setWalletAddr(addr);
      setFormErrors((prevVals: any) => {
        return {
          ...prevVals,
          [circuitInput.name]: undefined,
        };
      });

      const { set_id, merkle_root } = prfsSet;

      try {
        const { payload } = await GetPrfsTreeLeafIndices({
          set_id,
          leaf_vals: [addr],
        });

        let pos_w = null;
        // console.log("nodes", payload.prfs_tree_nodes);

        for (const node of payload.prfs_tree_nodes) {
          if (node.val === addr.toLowerCase()) {
            pos_w = node.pos_w;
          }
        }

        if (pos_w === null) {
          throw new Error("Address is not part of a set");
        }

        const leafIdx = Number(pos_w);
        const siblingPath = makeSiblingPath(32, leafIdx);
        const pathIndices = makePathIndices(32, leafIdx);

        const siblingPos = siblingPath.map((pos_w, idx) => {
          return { pos_h: idx, pos_w };
        });

        // console.log("leafIdx: %o, siblingPos: %o", leafIdx, siblingPos);

        const siblingNodesData = await getPrfsTreeNodesByPosRequest({
          set_id,
          pos: siblingPos,
        });

        let siblings: BigInt[] = [];
        for (const node of siblingNodesData.payload.prfs_tree_nodes) {
          siblings[node.pos_h] = BigInt(node.val);
        }

        for (let idx = 0; idx < 32; idx += 1) {
          if (siblings[idx] === undefined) {
            siblings[idx] = BigInt(0);
          }
        }

        const merkleProof: SpartanMerkleProof = {
          root: BigInt(merkle_root),
          siblings: siblings as bigint[],
          pathIndices,
        };

        setFormValues((prevVals: any) => {
          return {
            ...prevVals,
            [circuitInput.name]: merkleProof,
          };
        });
      } catch (err) {
        console.error(err);
      }
    },
    [setWalletAddr, setFormValues, prfsSet, GetPrfsTreeLeafIndices, setFormErrors, setIsOpen],
  );

  return (
    <FormInput>
      <FormInputTitleRow>
        <div>
          <FormInputTitle>
            <span>{circuitInput.label}</span>
            <span className={styles.setLabel}>({prfsSet ? prfsSet.label : i18n.loading})</span>
          </FormInputTitle>
        </div>
        <div className={styles.right}>
          <div className={styles.btnRow} ref={refs.setReference} {...getReferenceProps()}>
            <button>
              <RiEqualizerLine />
              {i18n.raw.toUpperCase()}
            </button>
          </div>
          <FloatingPortal>
            {isOpen && (
              <FloatingOverlay style={{ zIndex: zIndex || 200 }}>
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
        </div>
      </FormInputTitleRow>
      <InputWrapper>
        <div className={styles.interactiveArea}>
          <input
            className={styles.addressInput}
            placeholder={`${circuitInput.desc}`}
            value={walletAddr}
            readOnly
          />
          <div className={styles.btnGroup}>
            <WalletDialog handleChangeAddress={handleChangeAddress}>
              <Button variant="transparent_aqua_blue_1" className={styles.addressBtn}>
                {i18n.address.toUpperCase()}
              </Button>
            </WalletDialog>
          </div>
        </div>
        {value && <ComputedValue value={value} />}
      </InputWrapper>
      {error && <FormError>{error}</FormError>}
    </FormInput>
  );
};

export default MerkleProofInput;

export interface MerkleProofInputProps {
  circuitInput: CircuitInput;
  value: SpartanMerkleProof | undefined;
  error: string | undefined;
  setFormValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  setFormErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  zIndex?: number;
}

export interface ComputedValueProps {
  value: SpartanMerkleProof;
}
