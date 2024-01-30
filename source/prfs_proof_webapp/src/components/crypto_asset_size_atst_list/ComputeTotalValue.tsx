import React, { useId } from "react";
import { FaCalculator } from "@react-icons/all-files/fa/FaCalculator";
import { useMutation } from "@tanstack/react-query";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import { atstApi } from "@taigalabs/prfs-api-js";
import { ComputeCryptoAssetSizeTotalValuesRequest } from "@taigalabs/prfs-entities/bindings/ComputeCryptoAssetSizeTotalValuesRequest";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";

import styles from "./ComputeTotalValue.module.scss";
import { i18nContext } from "@/i18n/context";
import { useSignedInUser } from "@/hooks/user";
import { LocalPrfsProofCredential } from "@/storage/local_storage";
import DialogDefault from "@/components/dialog_default/DialogDefault";
import {
  DefaultModalBtnRow,
  DefaultModalDesc,
  DefaultModalHeader,
  DefaultModalWrapper,
} from "@/components/dialog_default/DialogComponents";

enum Status {
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
    if (computeStatus === Status.Done) {
      setIsOpen(false);
    } else {
      handleClickCalculate();
    }
  }, [handleClickCalculate, computeStatus, setIsOpen]);

  return (
    <DefaultModalWrapper>
      <DefaultModalHeader>
        <p>{i18n.compute_total_asset_value_in_usd}</p>
      </DefaultModalHeader>
      <DefaultModalDesc>
        <p>{i18n.this_might_take_minutes_or_longer}</p>
        <div className={styles.computeMsg}>{computeMsg}</div>
      </DefaultModalDesc>
      <DefaultModalBtnRow>
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
          disabled={computeStatus === Status.InProgress}
        >
          <div className={styles.btnContent}>
            <span>{computeStatus === Status.Done ? i18n.close : i18n.compute}</span>
            {computeStatus === Status.InProgress && <Spinner size={14} borderWidth={2} />}
          </div>
        </Button>
      </DefaultModalBtnRow>
    </DefaultModalWrapper>
  );
};

const ComputeTotalValueDialog: React.FC<ComputeTotalValueDialogProps> = ({
  credential,
  handleSucceedCompute,
}) => {
  const { prfsProofCredential } = useSignedInUser();
  const [isOpen, setIsOpen] = React.useState(false);
  const { mutateAsync: computeCryptoSizeTotalValuesRequest, isPending } = useMutation({
    mutationFn: (req: ComputeCryptoAssetSizeTotalValuesRequest) => {
      return atstApi("compute_crypto_asset_size_total_values", req);
    },
  });
  const [computeStatus, setComputeStatus] = React.useState(Status.Standby);
  const [computeMsg, setComputeMsg] = React.useState<React.ReactNode>(null);
  const handleClickCalculate = React.useCallback(async () => {
    if (prfsProofCredential) {
      setComputeStatus(Status.InProgress);
      try {
        const { payload } = await computeCryptoSizeTotalValuesRequest({
          account_id: prfsProofCredential.account_id,
        });

        if (payload) {
          setComputeStatus(Status.Done);
          setComputeMsg(
            <>
              <p>
                <b>Computed, row count: {payload.updated_row_count.toString()}</b>
              </p>
            </>,
          );
          handleSucceedCompute();
        }
      } catch (err) {
        setComputeStatus(Status.Standby);
      }
    }
  }, [
    prfsProofCredential,
    computeCryptoSizeTotalValuesRequest,
    setComputeMsg,
    setComputeStatus,
    handleSucceedCompute,
  ]);

  const createBase = React.useCallback(() => {
    return (
      <Button variant="circular_gray_1">
        <FaCalculator />
      </Button>
    );
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      setComputeStatus(Status.Standby);
      setComputeMsg(null);
    }
  }, [isOpen, setComputeStatus, setComputeMsg]);

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
  handleSucceedCompute: () => void;
}

export interface ModalProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleClickCalculate: () => {};
  computeStatus: Status;
  computeMsg: React.ReactNode;
}
