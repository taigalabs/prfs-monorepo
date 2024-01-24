import React, { useId } from "react";
import { FaCalculator } from "@react-icons/all-files/fa/FaCalculator";
import { useMutation } from "@tanstack/react-query";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import { atstApi } from "@taigalabs/prfs-api-js";
import { ComputeCryptoSizeTotalValuesRequest } from "@taigalabs/prfs-entities/bindings/ComputeCryptoSizeTotalValuesRequest";

import styles from "./ComputeTotalValue.module.scss";
import { i18nContext } from "@/i18n/context";
import CryptoSizeAtstTable from "./CryptoSizeAtstTable";
import {
  AttestationsHeader,
  AttestationsHeaderRow,
  AttestationsTitle,
} from "@/components/attestations/AttestationComponents";
import { AttestationsTopMenu } from "@/components/sets/SetComponents";
import { useSignedInUser } from "@/hooks/user";
import { MASTER_ACCOUNT_ID } from "@/mock/mock_data";
import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { LocalPrfsProofCredential } from "@/storage/local_storage";

const ComputeTotalValueDialog: React.FC<ComputeTotalValueDialogProps> = ({ credential }) => {
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
  const handleClickClose = React.useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const { prfsProofCredential } = useSignedInUser();
  const { mutateAsync: computeCryptoSizeTotalValuesRequest } = useMutation({
    mutationFn: (req: ComputeCryptoSizeTotalValuesRequest) => {
      return atstApi("compute_crypto_size_total_values", req);
    },
  });
  const handleClickCalculate = React.useCallback(async () => {
    if (prfsProofCredential) {
      const { payload } = await computeCryptoSizeTotalValuesRequest({
        account_id: prfsProofCredential.account_id,
      });

      console.log(123, payload);

      if (payload) {
      }
    }
  }, [prfsProofCredential, computeCryptoSizeTotalValuesRequest]);

  return (
    <>
      <div className={styles.base} ref={refs.setReference} {...getReferenceProps()}>
        <Button variant="circular_gray_1" handleClick={handleClickCalculate}>
          <FaCalculator />
        </Button>
      </div>
      <FloatingPortal>
        {isOpen && (
          <FloatingOverlay style={{ zIndex: 20 }}>
            <FloatingFocusManager context={context}>
              <div
                className={styles.dialog}
                ref={refs.setFloating}
                aria-labelledby={headingId}
                aria-describedby={descriptionId}
                {...getFloatingProps()}
              >
                123
                {/* <WalletModal */}
                {/*   handleClickClose={handleClickClose} */}
                {/*   handleChangeAddress={extendedHandleChangeAddress} */}
                {/* /> */}
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        )}
      </FloatingPortal>
    </>
  );
};

export default ComputeTotalValueDialog;

export interface ComputeTotalValueDialogProps {
  credential: LocalPrfsProofCredential;
}
