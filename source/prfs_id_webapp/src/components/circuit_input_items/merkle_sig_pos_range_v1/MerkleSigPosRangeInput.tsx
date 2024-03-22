import React from "react";
import cn from "classnames";
import { IoMdAlert } from "@react-icons/all-files/io/IoMdAlert";
import { prfsApi3, treeApi } from "@taigalabs/prfs-api-js";
import { PrfsSet } from "@taigalabs/prfs-entities/bindings/PrfsSet";
import ConnectWallet from "@taigalabs/prfs-react-lib/src/connect_wallet/ConnectWallet";
import { useMutation } from "@taigalabs/prfs-react-lib/react_query";
import { GetPrfsSetBySetIdRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsSetBySetIdRequest";
import { PrfsIdCredential } from "@taigalabs/prfs-id-sdk-web";
import { MerkleSigPosRangeV1Inputs } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1Inputs";
import { MerkleSigPosRangeV1Data } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1Data";
import { GetLatestPrfsTreeBySetIdRequest } from "@taigalabs/prfs-entities/bindings/GetLatestPrfsTreeBySetIdRequest";
import { MerkleSigPosRangeV1PresetVals } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1PresetVals";
import { PrfsTree } from "@taigalabs/prfs-entities/bindings/PrfsTree";
import { abbrev7and5 } from "@taigalabs/prfs-ts-utils";
import Input from "@taigalabs/prfs-react-lib/src/input/Input";
import HoverableText from "@taigalabs/prfs-react-lib/src/hoverable_text/HoverableText";

import styles from "./MerkleSigPosRange.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  FormError,
  FormInput,
  FormInputTitle,
  FormInputTitleRow,
} from "@/components/form_input/FormInput";
import { FormInputButton } from "@/components/circuit_inputs/CircuitInputComponents";
import CachedAddressDialog from "@/components/cached_address_dialog/CachedAddressDialog";
import {
  FormErrors,
  FormHandler,
  FormValues,
  HandleSkipCreateProof,
} from "@/components/circuit_input_items/formTypes";
import { envs } from "@/envs";
import RangeSelect from "./RangeSelect";
import MemoInput from "./MemoInput";
import {
  useCachedProveReceiptCreator,
  useMerkleSigPosRangeFormHandler,
} from "./use_merkle_sig_pos_range_form_handler";
import { useHandleChangeAddress } from "./use_handle_change_address";

const ComputedValue: React.FC<ComputedValueProps> = ({ value }) => {
  const val = React.useMemo(() => {
    if (value.merkleProof) {
      return (
        "Merkle root: " +
        value.merkleProof.root.toString().substring(0, 5) +
        "..., First sibling: " +
        value.merkleProof.siblings[0].toString().substring(0, 5) +
        "..."
      );
    }

    return null;
  }, [value]);

  return <div className={styles.computedValue}>{val}</div>;
};

const MerkleSigPosRangeInput: React.FC<MerkleSigPosRangeInputProps> = ({
  circuitTypeData,
  value,
  credential,
  error,
  setFormErrors,
  setFormValues,
  setFormHandler,
  presetVals,
  proofAction,
  usePrfsRegistry,
  handleSkipCreateProof,
}) => {
  const i18n = React.useContext(i18nContext);
  const [prfsSet, setPrfsSet] = React.useState<PrfsSet>();
  const [prfsTree, setPrfsTree] = React.useState<PrfsTree>();
  const [walletAddr, setWalletAddr] = React.useState("");
  const [rangeOptionIdx, setRangeOptionIdx] = React.useState(-1);

  const { isPending: isGetLatestPrfsTreePending, mutateAsync: getLatestPrfsTreeBySetId } =
    useMutation({
      mutationFn: (req: GetLatestPrfsTreeBySetIdRequest) => {
        return treeApi({ type: "get_latest_prfs_tree_by_set_id", ...req });
      },
    });

  const { mutateAsync: getPrfsSetBySetId } = useMutation({
    mutationFn: (req: GetPrfsSetBySetIdRequest) => {
      return prfsApi3({ type: "get_prfs_set_by_set_id", ...req });
    },
  });

  const labelElem = React.useMemo(() => {
    const url = `${envs.NEXT_PUBLIC_PRFS_PROOF_WEBAPP_ENDPOINT}/sets/${prfsSet?.set_id}`;

    function handleClick(ev: React.MouseEvent) {
      ev.preventDefault();

      if (prfsSet) {
        window.parent.window.open(url);
      }
    }

    let treeId = prfsTree ? prfsTree.tree_id.substring(0, 7) : "Loading...";

    return prfsSet ? (
      <span className={styles.inputLabel}>
        <span>{prfsSet.label}</span>
        <a className={styles.link} onClick={handleClick} href={url}>
          <HoverableText> ({treeId})</HoverableText>
        </a>
      </span>
    ) : (
      <span className={styles.inputLabel}>{i18n.loading}</span>
    );
  }, [prfsSet, prfsTree]);

  const abbrevWalletAddr = React.useMemo(() => {
    if (walletAddr.length > 10) {
      return abbrev7and5(walletAddr);
    }
    return "";
  }, [walletAddr]);

  useMerkleSigPosRangeFormHandler({ setFormHandler, setFormErrors, credential, proofAction });

  useCachedProveReceiptCreator({
    presetVals,
    usePrfsRegistry,
    credential,
    handleSkipCreateProof,
    proofAction,
  });

  React.useEffect(() => {
    async function fn() {
      if (circuitTypeData) {
        if (!circuitTypeData.prfs_set_id) {
          console.error("Prfs set id is not provided");
          return;
        }

        const { payload: getPrfsSetPayload } = await getPrfsSetBySetId({
          set_id: circuitTypeData.prfs_set_id,
        });

        const { payload: getLatestPrfsTreeBySetIdPayload } = await getLatestPrfsTreeBySetId({
          set_id: circuitTypeData.prfs_set_id,
        });

        if (!isGetLatestPrfsTreePending && getLatestPrfsTreeBySetIdPayload?.prfs_tree === null) {
          setFormErrors(prevVals => {
            return {
              ...prevVals,
              merkleProof: "Tree does not exist",
            };
          });
          return;
        }

        if (getPrfsSetPayload) {
          setPrfsSet(getPrfsSetPayload.prfs_set);
        }

        if (getLatestPrfsTreeBySetIdPayload?.prfs_tree) {
          setPrfsTree(getLatestPrfsTreeBySetIdPayload.prfs_tree);
        }
      } else {
        console.error("Prfs set not found");
      }
    }
    fn().then();
  }, [circuitTypeData, setPrfsSet, getPrfsSetBySetId, setPrfsTree]);

  const handleChangeAddress = useHandleChangeAddress({
    credential,
    prfsSet,
    prfsTree,
    setWalletAddr,
    setFormErrors,
    circuitTypeData,
    setRangeOptionIdx,
    setFormValues,
    proofAction,
  });

  return (
    <>
      <FormInput>
        <FormInputTitleRow>
          <FormInputTitle>{labelElem}</FormInputTitle>
        </FormInputTitleRow>
        <div className={styles.addrInputWrapper}>
          <Input
            inputClassName={styles.addrInput}
            labelClassName={styles.addrInput}
            name={""}
            label={i18n.wallet}
            value={abbrevWalletAddr}
            readOnly
            hasError={!!error?.merkleProof}
          />
          <div className={styles.btnRow}>
            <CachedAddressDialog handleChangeAddress={handleChangeAddress}>
              <FormInputButton type="button">{i18n.cache}</FormInputButton>
            </CachedAddressDialog>
            <span className={styles.or}> or </span>
            <ConnectWallet handleChangeAddress={handleChangeAddress}>
              <FormInputButton type="button">{i18n.connect}</FormInputButton>
            </ConnectWallet>
          </div>
        </div>
        {error?.merkleProof && (
          <FormError>
            <IoMdAlert />
            {error.merkleProof}
          </FormError>
        )}
        <div className={styles.row}>
          <MemoInput
            value={value}
            presetVals={presetVals}
            circuitTypeData={circuitTypeData}
            setFormValues={setFormValues}
            setFormErrors={setFormErrors}
            error={error}
          />
          {error?.nonceRaw && <FormError>{error.merkleProof}</FormError>}
        </div>
        <RangeSelect circuitTypeData={circuitTypeData} rangeOptionIdx={rangeOptionIdx} />
        {value && <ComputedValue value={value} />}
      </FormInput>
    </>
  );
};

export default MerkleSigPosRangeInput;

export interface MerkleSigPosRangeInputProps {
  circuitTypeData: MerkleSigPosRangeV1Data;
  value: FormValues<MerkleSigPosRangeV1Inputs>;
  error: FormErrors<MerkleSigPosRangeV1Inputs>;
  setFormValues: React.Dispatch<React.SetStateAction<MerkleSigPosRangeV1Inputs>>;
  setFormErrors: React.Dispatch<React.SetStateAction<FormErrors<MerkleSigPosRangeV1Inputs>>>;
  setFormHandler: React.Dispatch<React.SetStateAction<FormHandler | null>>;
  presetVals?: MerkleSigPosRangeV1PresetVals;
  credential: PrfsIdCredential;
  proofAction: string;
  usePrfsRegistry?: boolean;
  handleSkipCreateProof: HandleSkipCreateProof;
}

export interface ComputedValueProps {
  value: FormValues<MerkleSigPosRangeV1Inputs>;
}
