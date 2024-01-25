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
import { LocalPrfsProofCredential } from "@/storage/local_storage";
import DialogDefault from "@/components/dialog_default/DialogDefault";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";

const Modal: React.FC<ModalProps> = ({
  setIsOpen,
  handleClickCalculate,
  isPending,
  computeMsg,
}) => {
  const i18n = React.useContext(i18nContext);
  const handleClickClose = React.useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return (
    <div className={styles.modal}>
      <div className={styles.modalHeader}>
        <p>{i18n.compute_total_asset_value_in_usd}</p>
      </div>
      <div className={styles.modalDesc}>
        <p>{i18n.this_might_take_minutes_or_longer}</p>
        <p className={styles.computeMsg}>{computeMsg}</p>
      </div>
      <div className={styles.modalBtnRow}>
        <Button
          variant="transparent_black_1"
          noTransition
          handleClick={handleClickClose}
          type="button"
        >
          {i18n.close}
        </Button>
        <Button
          variant="blue_2"
          noTransition
          className={styles.computeBtn}
          handleClick={handleClickCalculate}
          noShadow
          type="button"
          disabled={isPending}
        >
          <div className={styles.btnContent}>
            <span>{i18n.compute}</span>
            {isPending && <Spinner size={14} borderWidth={2} />}
          </div>
        </Button>
      </div>
    </div>
  );
};

const ComputeTotalValueDialog: React.FC<ComputeTotalValueDialogProps> = ({ credential }) => {
  const { prfsProofCredential } = useSignedInUser();
  const { mutateAsync: computeCryptoSizeTotalValuesRequest, isPending } = useMutation({
    mutationFn: (req: ComputeCryptoSizeTotalValuesRequest) => {
      return atstApi("compute_crypto_size_total_values", req);
    },
  });
  const [computeMsg, setComputeMsg] = React.useState<React.ReactNode>(null);
  const handleClickCalculate = React.useCallback(async () => {
    if (prfsProofCredential) {
      const { payload } = await computeCryptoSizeTotalValuesRequest({
        account_id: prfsProofCredential.account_id,
      });

      if (payload) {
        setComputeMsg(<span>Computed, row count: {payload.updated_row_count.toString()}</span>);
      }
    }
  }, [prfsProofCredential, computeCryptoSizeTotalValuesRequest, setComputeMsg]);

  const createBase = React.useCallback((_: boolean) => {
    return (
      <Button variant="circular_gray_1" handleClick={handleClickCalculate}>
        <FaCalculator />
      </Button>
    );
  }, []);

  const createModal = React.useCallback((setIsOpen: React.Dispatch<React.SetStateAction<any>>) => {
    return (
      <Modal
        setIsOpen={setIsOpen}
        handleClickCalculate={handleClickCalculate}
        isPending={isPending}
        computeMsg={computeMsg}
      />
    );
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
  handleClickCalculate: () => {};
  isPending: boolean;
  computeMsg: React.ReactNode;
}
