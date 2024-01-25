import React, { useId } from "react";
import { FaCalculator } from "@react-icons/all-files/fa/FaCalculator";
import { useMutation } from "@tanstack/react-query";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import { atstApi } from "@taigalabs/prfs-api-js";
import { ComputeCryptoSizeTotalValuesRequest } from "@taigalabs/prfs-entities/bindings/ComputeCryptoSizeTotalValuesRequest";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";

import styles from "./ComputeTotalValue.module.scss";
import { i18nContext } from "@/i18n/context";
import { AttestationsTopMenu } from "@/components/sets/SetComponents";
import { useSignedInUser } from "@/hooks/user";
import { MASTER_ACCOUNT_ID } from "@/mock/mock_data";
import { LocalPrfsProofCredential } from "@/storage/local_storage";
import DialogDefault from "@/components/dialog_default/DialogDefault";

enum ComputeStatus {
  Standby,
  InProgress,
  Done,
}

const Modal: React.FC<ModalProps> = ({
  setIsOpen,
  handleClickCalculate,
  computeStatus,
  computeMsg,
}) => {
  const i18n = React.useContext(i18nContext);
  const handleClickClose = React.useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);
  const handleClickOk = React.useCallback(() => {
    if (computeStatus === ComputeStatus.Done) {
      window.location.reload();
    } else {
      handleClickCalculate();
    }
  }, [handleClickCalculate, computeStatus]);

  return (
    <div className={styles.modal}>
      <div className={styles.modalHeader}>
        <p>{i18n.compute_total_asset_value_in_usd}</p>
      </div>
      <div className={styles.modalDesc}>
        <p>{i18n.this_might_take_minutes_or_longer}</p>
        <div className={styles.computeMsg}>{computeMsg}</div>
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
          handleClick={handleClickOk}
          noShadow
          type="button"
          disabled={computeStatus === ComputeStatus.InProgress}
        >
          <div className={styles.btnContent}>
            <span>{computeStatus === ComputeStatus.Done ? i18n.reload : i18n.compute}</span>
            {computeStatus === ComputeStatus.InProgress && <Spinner size={14} borderWidth={2} />}
          </div>
        </Button>
      </div>
    </div>
  );
};

const ComputeTotalValueDialog: React.FC<ComputeTotalValueDialogProps> = ({ credential }) => {
  const { prfsProofCredential } = useSignedInUser();
  const [isOpen, setIsOpen] = React.useState(false);
  const { mutateAsync: computeCryptoSizeTotalValuesRequest, isPending } = useMutation({
    mutationFn: (req: ComputeCryptoSizeTotalValuesRequest) => {
      return atstApi("compute_crypto_size_total_values", req);
    },
  });
  const [computeStatus, setComputeStatus] = React.useState(ComputeStatus.Standby);
  const [computeMsg, setComputeMsg] = React.useState<React.ReactNode>(null);
  const handleClickCalculate = React.useCallback(async () => {
    if (prfsProofCredential) {
      setComputeStatus(ComputeStatus.InProgress);
      try {
        const { payload } = await computeCryptoSizeTotalValuesRequest({
          account_id: prfsProofCredential.account_id,
        });

        if (payload) {
          setComputeStatus(ComputeStatus.Done);
          setComputeMsg(
            <>
              <p>
                <b>Computed, row count: {payload.updated_row_count.toString()}</b>
              </p>
              <p>Reload the page</p>
            </>,
          );
        }
      } catch (err) {
        setComputeStatus(ComputeStatus.Standby);
      }
    }
  }, [prfsProofCredential, computeCryptoSizeTotalValuesRequest, setComputeMsg, setComputeStatus]);

  const createBase = React.useCallback(() => {
    return (
      <Button variant="circular_gray_1">
        <FaCalculator />
      </Button>
    );
  }, []);

  return (
    <>
      <DialogDefault isOpen={isOpen} setIsOpen={setIsOpen} createBase={createBase}>
        <Modal
          setIsOpen={setIsOpen}
          handleClickCalculate={handleClickCalculate}
          computeStatus={computeStatus}
          computeMsg={computeMsg}
        />
      </DialogDefault>
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
  computeStatus: ComputeStatus;
  computeMsg: React.ReactNode;
}
