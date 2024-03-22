import React from "react";
import { FaCalculator } from "@react-icons/all-files/fa/FaCalculator";
import { useMutation } from "@taigalabs/prfs-react-lib/react_query";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import { atstApi } from "@taigalabs/prfs-api-js";
import { ComputeCryptoAssetSizeTotalValuesRequest } from "@taigalabs/prfs-entities/bindings/ComputeCryptoAssetSizeTotalValuesRequest";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { ErrorBox } from "@taigalabs/prfs-react-lib/src/error_box/ErrorBox";

import styles from "./ComputeTotalValue.module.scss";
import { i18nContext } from "@/i18n/context";
import { LocalPrfsProofCredential } from "@/storage/local_storage";
import DialogDefault from "@/components/dialog_default/DialogDefault";
import {
  DefaultModalBtnRow,
  DefaultModalDesc,
  DefaultModalHeader,
  DefaultModalWrapper,
} from "@/components/dialog_default/DialogComponents";
import { CommonStatus } from "@/components/common_status/CommonStatus";

const Modal: React.FC<ModalProps> = ({
  setIsOpen,
  handleClickCalculate,
  computeStatus,
  computeMsg,
  error,
}) => {
  const i18n = React.useContext(i18nContext);
  const handleClickClose = React.useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);
  const handleClickOk = React.useCallback(() => {
    if (computeStatus === CommonStatus.Done) {
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
      {error && <ErrorBox rounded>{error}</ErrorBox>}
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
          variant="blue_3"
          noTransition
          className={styles.computeBtn}
          handleClick={handleClickOk}
          noShadow
          type="button"
          disabled={computeStatus === CommonStatus.InProgress}
        >
          <div className={styles.btnContent}>
            <span>{computeStatus === CommonStatus.Done ? i18n.close : i18n.compute}</span>
            {computeStatus === CommonStatus.InProgress && <Spinner size={14} borderWidth={2} />}
          </div>
        </Button>
      </DefaultModalBtnRow>
    </DefaultModalWrapper>
  );
};

const ComputeTotalValueDialog: React.FC<ComputeTotalValueDialogProps> = ({
  credential,
  rerender,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { mutateAsync: computeCryptoSizeTotalValuesRequest, isPending } = useMutation({
    mutationFn: (req: ComputeCryptoAssetSizeTotalValuesRequest) => {
      return atstApi({ type: "compute_crypto_asset_size_total_values", ...req });
    },
  });
  const [computeStatus, setComputeStatus] = React.useState(CommonStatus.Standby);
  const [computeMsg, setComputeMsg] = React.useState<React.ReactNode>(null);
  const handleClickCalculate = React.useCallback(async () => {
    setError(null);

    if (!credential) {
      setError("Credential does exist");
    }

    setComputeStatus(CommonStatus.InProgress);
    const { payload, error } = await computeCryptoSizeTotalValuesRequest({
      account_id: credential.account_id,
    });

    if (error) {
      setError(error.toString());
      setComputeStatus(CommonStatus.Standby);
      return;
    }

    if (payload) {
      setComputeStatus(CommonStatus.Done);
      setComputeMsg(
        <>
          <p>
            <b>Computed, row count: {payload.updated_row_count.toString()}</b>
          </p>
        </>,
      );
      rerender();
    }
    setComputeStatus(CommonStatus.Standby);
  }, [
    credential,
    computeCryptoSizeTotalValuesRequest,
    setComputeMsg,
    setComputeStatus,
    rerender,
    setError,
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
      setComputeStatus(CommonStatus.Standby);
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
          error={error}
        />
      </DialogDefault>
    </>
  );
};

export default ComputeTotalValueDialog;

export interface ComputeTotalValueDialogProps {
  credential: LocalPrfsProofCredential;
  rerender: () => void;
}

export interface ModalProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleClickCalculate: () => {};
  computeStatus: CommonStatus;
  computeMsg: React.ReactNode;
  error: string | null;
}
