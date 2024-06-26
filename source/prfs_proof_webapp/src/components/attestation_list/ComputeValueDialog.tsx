import React from "react";
import { FaCalculator } from "@react-icons/all-files/fa/FaCalculator";
import { useMutation } from "@taigalabs/prfs-react-lib/react_query";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import { atstApi } from "@taigalabs/prfs-api-js";
import { ComputeCryptoAssetTotalValuesRequest } from "@taigalabs/prfs-entities/bindings/ComputeCryptoAssetTotalValuesRequest";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { isMasterAccount } from "@taigalabs/prfs-admin-credential";
import { ErrorBox } from "@taigalabs/prfs-react-lib/src/error_box/ErrorBox";

import styles from "./ComputeValueDialog.module.scss";
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
import { useI18N } from "@/i18n/use_i18n";

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
            <span>{computeStatus === CommonStatus.Done ? i18n.done : i18n.compute}</span>
            {computeStatus === CommonStatus.InProgress && <Spinner size={14} borderWidth={2} />}
          </div>
        </Button>
      </DefaultModalBtnRow>
    </DefaultModalWrapper>
  );
};

const ComputeValueDialog: React.FC<ComputeTotalValueDialogProps> = ({ credential, rerender }) => {
  const i18n = useI18N();
  const [isOpen, setIsOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { mutateAsync: computeCryptoTotalValuesRequest, isPending } = useMutation({
    mutationFn: (req: ComputeCryptoAssetTotalValuesRequest) => {
      return atstApi({ type: "compute_crypto_asset_total_values", ...req });
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
    const { payload, error } = await computeCryptoTotalValuesRequest({
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
  }, [
    credential,
    computeCryptoTotalValuesRequest,
    setComputeMsg,
    setComputeStatus,
    rerender,
    setError,
  ]);

  const createBase = React.useCallback(() => {
    return (
      <Button
        variant="transparent_blue_3"
        noTransition
        type="button"
        disabled={!isMasterAccount(credential?.account_id)}
      >
        <div className={styles.btnContent}>
          <FaCalculator />
          <span>{i18n.calculate_values}</span>
        </div>
      </Button>
    );
  }, [credential]);

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

export default ComputeValueDialog;

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
