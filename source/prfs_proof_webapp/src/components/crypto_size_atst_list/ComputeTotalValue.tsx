import React, { useId } from "react";
import { FaCalculator } from "@react-icons/all-files/fa/FaCalculator";
import { useMutation } from "@tanstack/react-query";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import { atstApi } from "@taigalabs/prfs-api-js";
import { ComputeCryptoSizeTotalValuesRequest } from "@taigalabs/prfs-entities/bindings/ComputeCryptoSizeTotalValuesRequest";

import styles from "./ComputeTotalValue.module.scss";
import { i18nContext } from "@/i18n/context";
import { AttestationsTopMenu } from "@/components/sets/SetComponents";
import { useSignedInUser } from "@/hooks/user";
import { MASTER_ACCOUNT_ID } from "@/mock/mock_data";
import { useClick, useDismiss, useFloating, useInteractions, useRole } from "@floating-ui/react";
import { LocalPrfsProofCredential } from "@/storage/local_storage";
import DialogDefault from "@/components/dialog_default/DialogDefault";

const Modal: React.FC<ModalProps> = ({ setIsOpen }) => {
  return <div className={styles.modal}>123</div>;
};

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

  const createBase = React.useCallback((isOpen: boolean) => {
    return (
      <Button variant="circular_gray_1" handleClick={handleClickCalculate}>
        <FaCalculator />
      </Button>
    );
  }, []);

  const createModal = React.useCallback((setIsOpen: React.Dispatch<React.SetStateAction<any>>) => {
    return <Modal setIsOpen={setIsOpen} />;
  }, []);

  return (
    <>
      <DialogDefault createModal={createModal} createBase={createBase} />
    </>
  );
};

export default ComputeTotalValueDialog;

export interface ComputeTotalValueDialogProps {
  credential: LocalPrfsProofCredential;
}

export interface ModalProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
